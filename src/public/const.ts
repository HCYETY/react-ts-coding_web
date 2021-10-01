const REQUESTIP: string = "http://120.79.193.126:8080/api";

export {
  REQUESTIP
}

// location /api/ {
//   proxy_set_header Host $http_host;
//   proxy_set_header X-Real-IP $remote_addr;
//   proxy_set_header REMOTE-HOST $remote_addr;
//   proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
//   proxy_pass http://120.79.193.126:8080;
// }



// location / {
//   root   /usr/local/nginx/html/;
//   index  index.html index.htm;
//   try_files $uri $uri/ /index.html;
// }
