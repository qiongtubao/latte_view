        // 制作格式化参数
        function getParameter(cmd, sess, body) {
            return {
                "debug": {
                    "enable": true,
                    "depend": ""
                },
                "header": {
                    "size": 0,
                    "orn": "",
                    "dst": "",
                    "type": 3,
                    "cmd": cmd,
                    "ver": 512,
                    "lang": "zh_cn",
                    "sess": sess,
                    "seq": 0,
                    "code": 0,
                    "desc": "",
                    "stmp": 1234567890,
                    "ext": ""
                },
                "body": body
            }
        }
        // 设置加载进度条
        function setNProgress() {
            NProgress.configure({
                ease: 'ease',
                speed: 1000
            });
            NProgress.start();
            NProgress.done();
        }
        //日期格式化
        function formatTime(time) {
            // .replace(/T|.000Z/g, " ")
            var date = new Date(time);
            var year = date.getFullYear();
            var month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
            var datenum = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate();

            var hours = date.getHours() >= 10 ? date.getHours() : '0' + date.getHours();
            var minutes = date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes();
            var seconds = date.getSeconds() >= 10 ? date.getSeconds() : '0' + date.getSeconds();
            return year + '-' + month + '-' + datenum + ' ' + hours + ':' + minutes + ':' + seconds;
        }