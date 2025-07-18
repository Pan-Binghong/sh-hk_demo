#!/usr/bin/env python3
"""
生成自签名SSL证书用于开发环境
"""

from cryptography import x509
from cryptography.x509.oid import NameOID
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization
import datetime
import ipaddress

def generate_self_signed_cert():
    # 生成私钥
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048,
    )
    
    # 证书主题
    subject = issuer = x509.Name([
        x509.NameAttribute(NameOID.COUNTRY_NAME, u"CN"),
        x509.NameAttribute(NameOID.STATE_OR_PROVINCE_NAME, u"Beijing"),
        x509.NameAttribute(NameOID.LOCALITY_NAME, u"Beijing"),
        x509.NameAttribute(NameOID.ORGANIZATION_NAME, u"Development"),
        x509.NameAttribute(NameOID.COMMON_NAME, u"localhost"),
    ])
    
    # 创建证书
    cert = x509.CertificateBuilder().subject_name(
        subject
    ).issuer_name(
        issuer
    ).public_key(
        private_key.public_key()
    ).serial_number(
        x509.random_serial_number()
    ).not_valid_before(
        datetime.datetime.utcnow()
    ).not_valid_after(
        # 证书有效期1年
        datetime.datetime.utcnow() + datetime.timedelta(days=365)
    ).add_extension(
        x509.SubjectAlternativeName([
            x509.DNSName(u"localhost"),
            x509.DNSName(u"127.0.0.1"),
            x509.IPAddress(ipaddress.IPv4Address(u"127.0.0.1")),
            x509.IPAddress(ipaddress.IPv4Address(u"0.0.0.0")),
        ]),
        critical=False,
    ).sign(private_key, hashes.SHA256())
    
    # 写入证书文件
    with open("localhost.pem", "wb") as f:
        f.write(cert.public_bytes(serialization.Encoding.PEM))
    
    # 写入私钥文件
    with open("localhost-key.pem", "wb") as f:
        f.write(private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption()
        ))
    
    print("✅ SSL证书生成成功!")
    print("📄 证书文件: localhost.pem")
    print("🔑 私钥文件: localhost-key.pem")
    print("🌐 证书有效期: 1年")
    print("📍 支持域名: localhost, 127.0.0.1")

if __name__ == "__main__":
    try:
        generate_self_signed_cert()
    except ImportError:
        print("❌ 缺少cryptography库，正在安装...")
        import subprocess
        import sys
        subprocess.check_call([sys.executable, "-m", "pip", "install", "cryptography"])
        print("✅ cryptography库安装完成，重新生成证书...")
        generate_self_signed_cert() 