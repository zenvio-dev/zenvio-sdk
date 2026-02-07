from zenvio import Zenvio

def main():
    # 1. Initialize the client
    zenvio = Zenvio(api_key='your_api_key_here')

    phone_id = 'your_phone_id_here'
    recipient = '5511999999999'

    print("--- Starting Zenvio Python SDK Example ---")

    # 2. Send Simplified Text
    print("\n1. Sending simplified text...")
    res1 = zenvio.whatsapp.send_text(phone_id, recipient, "Hello from Python! 🐍")
    print(f"Result: {res1}")

    # 3. Send Image
    print("\n2. Sending image...")
    res2 = zenvio.whatsapp.send(phone_id, {
        "to": [recipient],
        "type": "image",
        "payload": {
            "url": "https://placehold.co/600x400/png",
            "caption": "Python logo (almost)",
            "filename": "image.png"
        }
    })
    print(f"Result: {res2}")

    # 4. Send Template
    print("\n3. Sending template...")
    res3 = zenvio.whatsapp.send(phone_id, {
        "to": [recipient],
        "type": "template",
        "payload": {
            "key": "welcome_template",
            "language": "en_US",
            "variables": ["Python Developer"]
        }
    })
    print(f"Result: {res3}")

if __name__ == "__main__":
    main()
