const express = require('express');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// body-parser 미들웨어 설정
app.use(bodyParser.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '200mb' }));

// 업로드된 파일을 저장할 디렉토리 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// multer 미들웨어 설정
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 200 * 1024 * 1024, // 200MB
  },
});

// 루트 경로에 파일 업로드 폼을 렌더링하는 라우트
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// 파일 업로드 처리 라우트
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  // 파일 업로드 성공 시, 업로드된 파일의 정보를 클라이언트에게 전달
  res.json({
    filename: req.file.filename,
    destination: req.file.destination,
  });
});

// 정적 파일 제공 (업로드된 파일에 접근하기 위해)
app.use('/uploads', express.static('uploads'));

// 정적 파일 제공 (test.html을 찾기 위해)
app.use(express.static('./'));

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
