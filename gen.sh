#!/bin/bash

# Exit on any error
set -e

OUT_DIR="./src/generated"
PROTO_DIR="./proto"

# Ensure directory exists cleanly
rm -rf "${OUT_DIR}"
mkdir -p "${OUT_DIR}"

npx protoc \
  --plugin="$(pwd)/node_modules/.bin/protoc-gen-ts_proto" \
  --ts_proto_out="${OUT_DIR}" \
  --ts_proto_opt=outputServices=grpc-js \
  --ts_proto_opt=esModuleInterop=true \
  --ts_proto_opt=env=node \
  --ts_proto_opt=useOptionals=all \
  --proto_path="${PROTO_DIR}" \
  "${PROTO_DIR}"/*.proto

echo "✅ Protobuf files generated successfully in ${OUT_DIR}"