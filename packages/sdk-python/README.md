# Zenvio Python SDK

Official Zenvio SDK for Python.

## Installation

```bash
pip install zenvio-sdk
```

## Quick Start

```python
from zenvio import Zenvio

# Initialize the client
zenvio = Zenvio(api_key='your-api-key')

phone_id = 'your-phone-id'

# 1. Simple text message
response = zenvio.whatsapp.send_text(phone_id, '5511999999999', 'Hello from Python!')
print(response)

# 2. Template message with full parameters
response = zenvio.whatsapp.send(phone_id, {
    'to': ['5511999999999'],
    'type': 'template',
    'payload': {
        'key': 'order_update',
        'language': 'en_US',
        'variables': ['John', 'Shipped']
    },
    'metadata': {
        'order_id': '123'
    }
})
```

## Features

- Fully typed with Python `TypedDict` for better IDE support.
- Namespaced API (`zenvio.whatsapp`).
- Simple error handling.
- Compatible with Python 3.8+.
