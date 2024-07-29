import React from "react";
import { useEffect, useState } from "react"


const ListView = () => {
    const [articles, setArticles] = useState(null);
	
    //ADD :: START
    const apiGet = async (type, param) => {
        const apiUrl = 'https://openapi.naver.com/v1/search/' + type + '?query=' + param;
        const resp = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Naver-Client-Id': CLIENT_ID,
                'X-Naver-Client-Secret': CLIENT_SECRET
            }
        });
        resp.json().then(data => {
            setArticles(data.items);
        });
    };
    //ADD :: END
}

export default ListView;
