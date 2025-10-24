import json
import os
import hashlib
import secrets
from typing import Dict, Any
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def generate_session_token() -> str:
    return secrets.token_urlsafe(32)

def serialize_user(user: Dict) -> Dict:
    result = dict(user)
    if 'created_at' in result and isinstance(result['created_at'], datetime):
        result['created_at'] = result['created_at'].isoformat()
    if 'updated_at' in result and isinstance(result['updated_at'], datetime):
        result['updated_at'] = result['updated_at'].isoformat()
    return result

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: User authentication - register, login, get profile, update profile
    Args: event with httpMethod, body, headers
    Returns: HTTP response with user data or error
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Session-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    db_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(db_url)
    
    try:
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'register':
                email = body.get('email')
                password = body.get('password')
                nickname = body.get('nickname', email.split('@')[0])
                
                cursor = conn.cursor(cursor_factory=RealDictCursor)
                
                cursor.execute("SELECT nextval('user_id_seq')")
                user_number = cursor.fetchone()['nextval']
                user_id = f"#{user_number}"
                
                password_hash = hash_password(password)
                session_token = generate_session_token()
                
                cursor.execute(
                    "INSERT INTO users (user_id, email, password_hash, nickname, balance, session_token) VALUES (%s, %s, %s, %s, %s, %s)",
                    (user_id, email, password_hash, nickname, 1000, session_token)
                )
                conn.commit()
                
                cursor.execute(
                    "SELECT user_id, email, nickname, avatar_url, balance, created_at FROM users WHERE user_id = %s",
                    (user_id,)
                )
                user = cursor.fetchone()
                cursor.close()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'success': True,
                        'user': serialize_user(user),
                        'session_token': session_token
                    }),
                    'isBase64Encoded': False
                }
            
            elif action == 'login':
                email = body.get('email')
                password = body.get('password')
                password_hash = hash_password(password)
                
                cursor = conn.cursor(cursor_factory=RealDictCursor)
                cursor.execute(
                    "SELECT user_id, email, nickname, avatar_url, balance, created_at FROM users WHERE email = %s AND password_hash = %s",
                    (email, password_hash)
                )
                user = cursor.fetchone()
                cursor.close()
                
                if not user:
                    return {
                        'statusCode': 401,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({'success': False, 'error': 'Invalid credentials'}),
                        'isBase64Encoded': False
                    }
                
                session_token = generate_session_token()
                
                cursor = conn.cursor()
                cursor.execute(
                    "UPDATE users SET session_token = %s WHERE email = %s",
                    (session_token, email)
                )
                conn.commit()
                cursor.close()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'success': True,
                        'user': serialize_user(user),
                        'session_token': session_token
                    }),
                    'isBase64Encoded': False
                }
        
        elif method == 'PUT':
            auth_token = event.get('headers', {}).get('X-Session-Token') or event.get('headers', {}).get('x-session-token')
            
            if not auth_token:
                return {
                    'statusCode': 401,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'success': False, 'error': 'Unauthorized'}),
                    'isBase64Encoded': False
                }
            
            body = json.loads(event.get('body', '{}'))
            user_id = body.get('user_id')
            nickname = body.get('nickname')
            avatar_url = body.get('avatar_url')
            
            cursor = conn.cursor(cursor_factory=RealDictCursor)
            
            update_fields = []
            update_values = []
            
            if nickname:
                update_fields.append('nickname = %s')
                update_values.append(nickname)
            
            if avatar_url is not None:
                update_fields.append('avatar_url = %s')
                update_values.append(avatar_url)
            
            if update_fields:
                update_fields.append('updated_at = CURRENT_TIMESTAMP')
                update_values.append(auth_token)
                
                query = f"UPDATE users SET {', '.join(update_fields)} WHERE session_token = %s"
                cursor.execute(query, update_values)
                conn.commit()
            
            cursor.execute(
                "SELECT user_id, email, nickname, avatar_url, balance, created_at FROM users WHERE session_token = %s",
                (auth_token,)
            )
            user = cursor.fetchone()
            cursor.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'user': dict(user)
                }),
                'isBase64Encoded': False
            }
        
        elif method == 'GET':
            auth_token = event.get('headers', {}).get('X-Auth-Token') or event.get('headers', {}).get('x-auth-token')
            user_id = event.get('queryStringParameters', {}).get('user_id')
            
            if not auth_token or not user_id:
                return {
                    'statusCode': 401,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'success': False, 'error': 'Unauthorized'}),
                    'isBase64Encoded': False
                }
            
            cursor = conn.cursor(cursor_factory=RealDictCursor)
            cursor.execute(
                "SELECT user_id, email, nickname, avatar_url, balance, created_at FROM users WHERE user_id = %s",
                (user_id,)
            )
            user = cursor.fetchone()
            cursor.close()
            
            if not user:
                return {
                    'statusCode': 404,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'success': False, 'error': 'User not found'}),
                    'isBase64Encoded': False
                }
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'user': dict(user)
                }),
                'isBase64Encoded': False
            }
    
    finally:
        conn.close()
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }