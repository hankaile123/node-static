const http = require("http");
const fs = require("fs");
let port = process.argv[2] || process.env.PORT;
if (!port) {
    console.log("麻烦指定一下端口号");
    process.exit(1);
}
let app = http.createServer();


app.on("request", (request, response) => {

    const method = request.method.toLowerCase();
    const { pathname, search } = new URL(request.url, `http://localhost:${port}`);
    console.log(`接收请求，路径：${pathname}, 参数: ${search}`);
    if (method === "get") {
        const responsePath = pathname === '/' ? '/index.html' : pathname
        const index = responsePath.lastIndexOf('.')
        const suffix = responsePath.substr(index)
        const fileTypes = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'text/javascript',
            '.jpg': 'image/jpeg',
            '.png': 'image/png'
        }
        response.statusCode = 200
        response.setHeader('Content-Type', `${fileTypes[suffix] || 'text/html'};charset=utf-8`)
        let content
        try {
            content = fs.readFileSync(`./public${responsePath}`)
        } catch (error) {
            response.statusCode = 404
            content = '请求页面不存在'
        }
        response.write(content)
        response.end()

        // const responsePath = pathname === '/' ? '/index.html' : pathname
        // const index = responsePath.lastIndexOf('.')
        // const suffix = responsePath.substr(index)
        // const fileTypes = {
        //     '.html': 'text/html',
        //     '.css': 'text/css',
        //     '.js': 'text/javascript',
        //     '.png': 'images/png',    多个s就是下载...找半天错
        //     '.jpg': 'images/jpeg'
        // }
        // response.statusCode = 200
        // response.setHeader('Content-Type', `${fileTypes[suffix] || 'text/html'};charset=utf-8`)
        // let content
        // try {
        //     content = fs.readFileSync(`./public${responsePath}`)
        // } catch (error) {
        //     response.statusCode = 404;
        //     content = `请求的文件不存在`
        // }
        // response.write(content)
        // response.end()
    }
});
app.listen(port);