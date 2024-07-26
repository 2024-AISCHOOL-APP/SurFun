// // server/Express.js
// const express = require('express');
// const axios = require('axios');
// const app = express();
// const port = 5000;

// app.get('/api/oceangrid/DataType/search.do', async (req, res) => {
//   try {
//     // 실제 외부 API에 요청을 보냅니다
//     const response = await axios.get('http://www.khoa.go.kr/api/oceangrid/DataType/search.do', {
//       params: {
//         ServiceKey: 'tI3hNatwRnUJkXV3cPHXew==', // 여기에 실제 인증키를 입력하세요
//         Type: req.query.Type, // 클라이언트에서 Type 파라미터 전달
//         ResultType: 'json'
//       }
//     });
//     res.json(response.data); // 클라이언트에 응답 데이터 전송
//   } catch (error) {
//     res.status(500).send(error.toString()); // 오류 처리
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });








// // const express = require('express');
// // const axios = require('axios');
// // const app = express();
// // const port = 5000;

// // // app.use(express.json()); // JSON 요청의 본문을 파싱하기 위해 필요
// // // app.use(express.urlencoded({ extended: false }));

// // app.get('/api/oceangrid/DataType/search.do', async (req, res) => {
// //   try {
// //     const response = await axios.get('http://www.khoa.go.kr/api/oceangrid/DataType/search.do', {
// //       params: {
// //         ServiceKey: 'tI3hNatwRnUJkXV3cPHXew==',
// //         Type: req.query.Type, // 클라이언트에서 Type 파라미터 전달
// //         ResultType: req.query.ResultType // 클라이언트에서 ResultType 파라미터 전달
// //       }
// //     });
// //     res.json(response.data);
// //   } catch (error) {
// //     res.status(500).send(error.toString());
// //   }
// // });

// // app.listen(port, () => {
// //   console.log(`Server is running on http://localhost:${port}`);
// // });
