'''
Business: Управление балансом, инвентарём и открытием кейсов
Args: event с httpMethod, body, headers (X-Session-Token)
Returns: JSON с данными пользователя, балансом и инвентарём
'''

import json
import os
from typing import Dict, Any, List
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    conn.set_session(autocommit=False)
    return conn

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Session-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    headers = event.get('headers', {})
    session_token = headers.get('X-Session-Token') or headers.get('x-session-token')
    
    if not session_token:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Unauthorized'})
        }
    
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        cur.execute("SELECT id, balance FROM users WHERE session_token = %s", (session_token,))
        user = cur.fetchone()
        
        if not user:
            cur.close()
            conn.close()
            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Invalid session'})
            }
        
        user_id = user['id']
        
        if method == 'GET':
            cur.execute("""
                SELECT id, item_name, item_rarity, item_image, item_price, obtained_at 
                FROM inventory 
                WHERE user_id = %s 
                ORDER BY obtained_at DESC
            """, (user_id,))
            inventory_rows = cur.fetchall()
            
            inventory = []
            for row in inventory_rows:
                inventory.append({
                    'id': row['id'],
                    'name': row['item_name'],
                    'rarity': row['item_rarity'],
                    'image': row['item_image'],
                    'price': row['item_price']
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'balance': user['balance'],
                    'inventory': inventory
                })
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action')
            
            if action == 'open_case':
                case_price = body_data.get('price', 0)
                
                if user['balance'] < case_price:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'isBase64Encoded': False,
                        'body': json.dumps({'error': 'Insufficient balance'})
                    }
                
                cur.execute(
                    "UPDATE users SET balance = balance - %s WHERE id = %s RETURNING balance",
                    (case_price, user_id)
                )
                new_balance_row = cur.fetchone()
                new_balance = new_balance_row['balance']
                
                item_name = body_data.get('item_name')
                item_rarity = body_data.get('item_rarity')
                item_image = body_data.get('item_image')
                item_price = body_data.get('item_price', 0)
                
                cur.execute("""
                    INSERT INTO inventory (user_id, item_name, item_rarity, item_image, item_price)
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING id
                """, (user_id, item_name, item_rarity, item_image, item_price))
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'balance': new_balance})
                }
            
            elif action == 'sell_item':
                item_id = body_data.get('item_id')
                
                cur.execute(
                    "SELECT item_price FROM inventory WHERE id = %s AND user_id = %s",
                    (item_id, user_id)
                )
                item = cur.fetchone()
                
                if not item:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'isBase64Encoded': False,
                        'body': json.dumps({'error': 'Item not found'})
                    }
                
                cur.execute(
                    "UPDATE users SET balance = balance + %s WHERE id = %s RETURNING balance",
                    (item['item_price'], user_id)
                )
                new_balance_row = cur.fetchone()
                new_balance = new_balance_row['balance']
                
                cur.execute("DELETE FROM inventory WHERE id = %s", (item_id,))
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'balance': new_balance})
                }
            
            elif action == 'deposit':
                amount = body_data.get('amount', 0)
                
                cur.execute(
                    "UPDATE users SET balance = balance + %s WHERE id = %s RETURNING balance",
                    (amount, user_id)
                )
                new_balance_row = cur.fetchone()
                new_balance = new_balance_row['balance']
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'balance': new_balance})
                }
            
            else:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Unknown action'})
                }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Method not allowed'})
            }
    
    finally:
        cur.close()
        conn.close()