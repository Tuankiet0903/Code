# Build image

docker build -t vite-app .

# Run container

docker run -p 5173:5173 vite-app
