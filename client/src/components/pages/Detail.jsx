import React from 'react'

const Detail = () => {
  return (
    <div className='detailcontainer'>
        <h1 className='search-h1'>바다예보
            <img src='/parassol.png' className='solimg'></img>
        </h1>
        <br></br>
        <div >
            <h1>00해변
                <button>관심스팟</button>
                <button>추천일 알람설정</button>
            </h1>
            <hr className='csshr'/>
        </div>    
    <div className='graph'>
        <h2 className='graph-h2'>
            주간예보 <span className='graph-h2span'>일간예보</span>
         </h2>
                
            <h3 className='realgraph'>
                 그래프 1<span className='real-graphspan'>그래프 2</span>
                  {/* 나중에 진짜 그래프 넣어라 */}
             </h3>
    <div className='todaysea'>    
        <h1 className='todayseah1'>오늘의바다</h1>
        <hr className='csshr'/>
        <img src='/surfgood.png' className='surfgoodimg'></img>
        <h3 className='todayexplain'>
        오늘 000은 서핑 하기 참 좋은날이어유
            초보 서퍼들은 서핑보드들고 냅다 나가봐유
        </h3>
    </div>
    <div className='first-line'>
        <h2 >
            <span >날짜</span>
            <span className='graph-h2span'>바람</span>
            <span className='graph-h2span'>날씨(기온/수온)</span>
            <span className='graph-h2span'>파도</span>
            <span className='graph-h2span'>날씨</span>

        </h2>
    </div>                   
    </div>
        
    </div>
  )
}

export default Detail