import React,{ useEffect,useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useDispatch, useSelector } from 'react-redux';
import { GetHomeChartRpt } from '../../deliveries/store/DelServices';


const LineChart = () => {
  
  const dispatch = useDispatch();
  const [dataDeliveries,setDataDeliveries] = useState([]);
  const [dataTransactions,setDataTransactions] = useState([]);

  let labels = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  const options = {
      animations: {
          tension: {
              duration: 1000,
              easing: 'easeOutQuart',
              from: 1,
              to: 0,
              loop: true
          }
      },
      responsive: true,
      scales: {
          yAxes: [
            {
                ticks: {
                  beginAtZero: true,
                },
            },
          ]
      },
  };

  useEffect(()=>{    
      const resData = async()=>{

          const res = await dispatch( GetHomeChartRpt({
            opt : {
                url : '/deliveries/count/monthly'
            }
          }));

          if( GetHomeChartRpt.fulfilled.match(res) ){
            const dataArr = [];
            res.payload.map((rpt,index)=>{
              const ind = rpt._id.month - 1;
          
              for( let i=0; i <= labels.length;i++ ){
                  if( i === ind ){
                      dataArr[i] = rpt.delivery_count;
                  }else{
                      dataArr.push(0);
                  }
              }
              
            });
            setDataDeliveries(dataArr);
          }
      }      

      resData();

  },[]);

  return(
    <>
        <Line 
          data={{
            labels,
            datasets: [
              {
                label: 'Orders',
                data: dataDeliveries,
                fill: false,
                backgroundColor: '#36A2EB',
                borderColor: '#36A2EB',
              },
              {
                label: 'Transactions',
                data: dataDeliveries,
                fill: false,
                backgroundColor: '#FF6384',
                borderColor: '#FF6384',
              }
            ],
          }} options={options} />
    </>
  )
};

export default LineChart;