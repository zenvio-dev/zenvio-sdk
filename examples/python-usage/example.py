"""
Exemplo de uso do Zenvio SDK para Python — WhatsApp, SMS, Email e template.
"""

from zenvio import Zenvio

def main():
    zenvio = Zenvio(api_key="your_api_key_here")
    instance_id = "your_instance_id_here"
    phone = "5511999999999"
    email = "user@example.com"

    print("--- Zenvio Python SDK ---")

    # WhatsApp: texto (payload.message)
    print("\n1. WhatsApp texto...")
    res = zenvio.whatsapp.send_text(instance_id, phone, "Olá do Python!")
    print("message_ids:", res.get("message_ids"), "status:", res.get("status"))

    # WhatsApp: imagem (payload.media_url)
    print("\n2. WhatsApp imagem...")
    res = zenvio.whatsapp.send(instance_id, {
        "to": [phone],
        "type": "image",
        "payload": {"media_url": "https://placehold.co/600x400/png"},
    })
    print("message_ids:", res.get("message_ids"))

    # SMS
    print("\n3. SMS...")
    res = zenvio.sms.send({"to": [phone], "message": "SMS de teste"})
    print("sms_ids:", res.get("data", {}).get("sms_ids"))

    # Email (use from_address; domínio deve estar verificado)
    print("\n4. Email...")
    res = zenvio.email.send({
        "from_address": "noreply@seudominio.com",
        "to": [email],
        "subject": "Teste",
        "html": "<p>Olá!</p>",
    })
    print("email_ids:", res.get("data", {}).get("email_ids"))

    # Envio por template (whatsapp + sms + email)
    print("\n5. Template multi-canal...")
    res = zenvio.messages.send({
        "to": [phone, email],
        "template": "welcome",
        "variables": {"name": "Trial", "credits": 300},
        "channels": ["whatsapp", "sms", "email"],
        "instance_id": instance_id,
        "from_address": "noreply@seudominio.com",
    })
    print("data:", res.get("data"))


if __name__ == "__main__":
    main()
