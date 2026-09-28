#! /bin/bash
echo '################CARGANDO NOMBRES DE IMAGENES#################'
sleep 2
export version_back="reddebjsh/jornadas2025:back-1.0.0"
export version_front="reddebjsh/jornadas2025:front-1.0.0"
export version_proxy="reddebjsh/jornadas2025:proxy-1.0.0"


echo '################TERMINADO#################'
sleep 1

echo '################CONSTRUYENDO BACKEND#########################'
sleep 2
docker buildx build -f Dockerfile_back -t "$version_back" --cache-from type=registry,ref=$version_back --cache-to type=inline --push .
echo '################TERMINADO#################'
sleep 1


echo '################CONSTRUYENDO NGINX DE FRONTEND#################'
sleep 2
docker buildx build -f Dockerfile_front -t "$version_front" --cache-from type=registry,ref=$version_front --cache-to type=inline --push .
echo '################TERMINADO#####################################'
sleep 1

echo '################CONSTRUYENDO NGINX DE PROXY#################'
sleep 2
docker buildx build -f Dockerfile_proxy -t "$version_proxy" --cache-from type=registry,ref=$version_proxy --cache-to type=inline --push .