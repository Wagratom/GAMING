keytool -genkeypair \
  -alias meu-alias \
  -keyalg RSA \
  -keysize 2048 \
  -storetype PKCS12 \
  -keystore keystore.p12 \
  -validity 3650 \
  -storepass minhaSenha123 \
  -keypass minhaSenha123 \
  -dname "CN=bankai, OU=itau, O=itau, L=minas, ST=montes_claros, C=EU"
