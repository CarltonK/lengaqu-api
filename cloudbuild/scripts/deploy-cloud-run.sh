echo
echo "************************"
echo "* Set Backend project *"
echo "************************"
echo

gcloud config set project $2

gcloud config set run/region $3

echo
echo "************************"
echo "* Variable subsitituion *"
echo "************************"
echo

awk '{gsub(/<KAPI_CONTAINER_IMAGE>/,"gcr.io/'$2'/'$1':'$5'")}1' /workspace/service.yaml >/workspace/tmp.yaml && mv /workspace/tmp.yaml /workspace/service.yaml
awk '{gsub(/<MIN_SCALE>/,"'$6'")}1' /workspace/service.yaml >/workspace/tmp.yaml && mv /workspace/tmp.yaml /workspace/service.yaml
awk '{gsub(/<MAX_SCALE>/,"'$7'")}1' /workspace/service.yaml >/workspace/tmp.yaml && mv /workspace/tmp.yaml /workspace/service.yaml
awk '{gsub(/<KAPI_SA>/,"'$8'")}1' /workspace/service.yaml >/workspace/tmp.yaml && mv /workspace/tmp.yaml /workspace/service.yaml
awk '{gsub(/<JWT_SECRET_KEY>/,"'$9'")}1' /workspace/service.yaml >/workspace/tmp.yaml && mv /workspace/tmp.yaml /workspace/service.yaml
awk '{gsub(/<DATABASE_INSTANCE_CONNECTION_NAME>/,"'$4'")}1' /workspace/service.yaml >/workspace/tmp.yaml && mv /workspace/tmp.yaml /workspace/service.yaml
awk '{gsub(/<GOOGLE_CLOUD_PROJECT>/,"'${10}'")}1' /workspace/service.yaml >/workspace/tmp.yaml && mv /workspace/tmp.yaml /workspace/service.yaml


echo
echo "************************"
echo "* Deploy *"
echo "************************"
echo

yes | gcloud beta run services replace service.yaml --platform=managed
