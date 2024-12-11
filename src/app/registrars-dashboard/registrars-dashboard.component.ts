import { Component, OnInit } from '@angular/core';
import { RegistrarDashboardServiceService } from './service/registrar-dashboard-service.service';
import { Chart, BarController, BarElement, LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';


// Register required components
Chart.register(BarController,LineController,PointElement, LineElement,BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Week = 'week';
const Month = 'month';
const Year = 'year';
@Component({
  selector: 'app-registrars-dashboard',
  templateUrl: './registrars-dashboard.component.html',
  styleUrls: ['./registrars-dashboard.component.css']
})
export class RegistrarsDashboardComponent implements OnInit {
  

  periodFiltersApplication:string=Week
  periodFilterForPriceTrend:string=Week
  paymentTrendChart:any;
  applicationChart:any;
  applicationYearLabel:any[]=[];
  TotalApplicationStatusForWeek:any[]=[]
  TotalApplicationStatusForMonth:any[]=[]
  TotalApplicationStatusForYear:any[]=[]
  totalRegistrants:number=0
  totalDomains:number=0
  applicationInQueue:number=0
  revenueCollected:number=0
  constructor(private registrarDashboardService:RegistrarDashboardServiceService){}
  ngOnInit(): void {
    this.fetchDataForTopCards();
    this.fetchDataForDomainRegistration('email');
    this.fetchDataForPaymentTrend();
  }

  fetchDataForTopCards(){
    // this.
  }
  fetchDataForDomainRegistration(emailIds) {
    if(this.applicationChart!=null){
      this.applicationChart.destroy();
    }
    this.createDomainTrendChart();
  }
  fetchDataForPaymentTrend(){
    if(this.paymentTrendChart!=null){
      this.paymentTrendChart.destroy();
    }
    this.createpaymentTrendChart();
  }
  createDomainTrendChart(){
    if(this.periodFiltersApplication===Week){
      this.applicationChart = new Chart("applicationChart", {
        type: 'bar',
        data: {
          labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          datasets: [
            {
              label: ".fin.in",
              data: [2,4,5,6,7,5,2],
              backgroundColor: '#F2AA86',
              // backgroundColor: dayColors,
              barPercentage: 0.8,
              stack:'Stack 0',
              order:1
            },
            {
              label: ".bank.in",
              data: [2,2,7,1,2,8,3],
              // backgroundColor: dayColors,
              backgroundColor:' #9EDEF8',
              barPercentage: 0.8,
              stack:'Stack 0',
              order:1
            },
            {
              label: "Total Domain",
              data: [4,6,12,7,9,13,5],
              // backgroundColor: dayColors,
              type:'line',
              order:0,
              // borderColor: "green",
              borderWidth:1,
                pointStyle:"rectRot",
             // pointRadius: 3,
              //pointHoverRadius:4,
              borderColor: "#156082",
              pointBorderColor:'#156082',
              backgroundColor: "#156082",
             
                datalabels: {
                  anchor: 'center',
                  align: 'top',
                  // offset: -18,
                  formatter: Math.round,
                  font: {
                    weight: 'bolder'
                  },
                  color:"#156082",
                  display: function(context) { // Filter out zeros
                    const value = context.dataset.data[context.dataIndex];
                    return value !== 0;
                  },
                  // ... other datalabel options (optional)
                }
             
            }
          ]
        },
        options: {
          responsive: true,
          aspectRatio: 2.0,
          scales: {
            x: {
              display: true,
              stacked:true,
              
              grid: {
                display: false,
              },
            },
            y: {
              display: true,
              // suggestedMax:SuggestedWeekMax,
              grid: {
                display: false,
              },
              ticks: {
                stepSize: 1, // Set stepSize to 1 to display only whole numbers on the y-axis
              },
            },
          },
          plugins: {
            datalabels: {
              anchor: 'center',
              align: 'center',
              // offset: -18,
              formatter: Math.round,
              font: {
              //weight: 'bolder'
              family:'Aptos Narrow',
            },
              color:"#000",
              display: function(context) { // Filter out zeros
                const value = context.dataset.data[context.dataIndex];
                return value !== 0;
              },
              // ... other datalabel options (optional)
            },
            legend: {
              display: true,
              position: 'bottom',
              align: 'center',
              labels: {
                usePointStyle: true,
                font: {
                  size: 12,
                },
                padding: 16,
                pointStyle: 'rectRounded',

              },
            },
            // title: {
            //   text:"Action Items by Priority",
            //   position:"bottom",
            //   padding:{
            //     top:10
            //   },
            //   display: true,
            //  text: '   '+this.meetingChartText,
            //   align: 'center',
            //   font: {
            //     size: 14,
            //   },
            // },
          },
          // elements: {
          //   // arc: {
          //   //   borderRadius: 3,
          //   //   borderWidth: 2,
          //   //   borderAlign: 'inner' // Set the border width for pie chart segments
          //   // },
          // },
        }
      });
    }else  if(this.periodFiltersApplication===Month){
      this.applicationChart = new Chart("applicationChart", {
        type: 'bar',
        data: {
          xLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: ".fin.in",
              data:  [2,2,2,2,3,7,8,1,3,6,6,11],
              backgroundColor: '#F2AA86',
              // backgroundColor: dayColors,
              barPercentage: 0.8,
              stack:'Stack 0',
              order:1
            },
            {
              label: ".bank.in",
              data: [2,1,4,3,7,1,4,8,2,10,6,2],
              // backgroundColor: dayColors,
              backgroundColor:'#9EDEF8',
              barPercentage: 0.8,
              stack:'Stack 0',
              order:1
            },
            {
              label: "Total Domain",
              data: [4,3,6,5,10,8,12,11,8,2,11,5],
              // backgroundColor: dayColors,
              type:'line',
              order:0,
              // borderColor: "green",
              borderWidth:1,
              pointStyle:"rectRot",
              // pointRadius: 3,
              //pointHoverRadius:4,
              borderColor: "#156082",
            pointBorderColor:'#156082',
            backgroundColor: "#156082",
             
                datalabels: {
                  anchor: 'center',
                  align: 'top',
                  // offset: -18,
                  formatter: Math.round,
                  font: {
                    weight: 'bolder'
                  },
                  color:"#156082",
                  display: function(context) { // Filter out zeros
                    const value = context.dataset.data[context.dataIndex];
                    return value !== 0;
                  },
                  // ... other datalabel options (optional)
                }
             
            }
          ]
        },
        options: {
          responsive: true,
          aspectRatio: 2.0,
          scales: {
            x: {
              display: true,
              stacked:true,
              
              grid: {
                display: false,
              },
            },
            y: {
              display: true,
              // suggestedMax:SuggestedMonthMax,
              grid: {
                display: false,
              },
              ticks: {
                stepSize: 1, // Set stepSize to 1 to display only whole numbers on the y-axis
              },
            },
          },
          plugins: {
            datalabels: {
              anchor: 'center',
              align: 'center',
              // offset: -18,
              formatter: Math.round,
              font: {
              //weight: 'bolder'
              family:'Aptos Narrow',
            },
              color:"#000",
              display: function(context) { // Filter out zeros
                const value = context.dataset.data[context.dataIndex];
                return value !== 0;
              },
              // ... other datalabel options (optional)
            },
            legend: {
              display: true,
              position: 'bottom',
              align: 'center',
              labels: {
                usePointStyle: true,
                font: {
                  size: 12,
                },
                padding: 16,
                pointStyle: 'rectRounded',

              },
            },
            title: {
              text:"Action Items by Priority",
              position:"bottom",
              padding:{
                top:10
              },
              display: true,
            //  text: '   '+this.meetingChartText,
              align: 'center',
              font: {
                size: 14,
              },
            },
          },
          // elements: {
          //   // arc: {
          //   //   borderRadius: 3,
          //   //   borderWidth: 2,
          //   //   borderAlign: 'inner' // Set the border width for pie chart segments
          //   // },
          // },
        }
      });
    }else  if(this.periodFiltersApplication===Year){
      this.applicationChart = new Chart("applicationChart", {
        type: 'bar',
        data: {
          xLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: ".fin.in",
              data:  [2,2,2,2,3,7,8,1,3,6,6,11],
              backgroundColor: '#F2AA86',
              // backgroundColor: dayColors,
              barPercentage: 0.8,
              stack:'Stack 0',
              order:1
            },
            {
              label: ".bank.in",
              data: [2,1,4,3,7,1,4,8,2,10,6,2],
              // backgroundColor: dayColors,
              backgroundColor:'#9EDEF8',
              barPercentage: 0.8,
              stack:'Stack 0',
              order:1
            },
            {
              label: "Total Domain",
              data: [4,3,6,5,10,8,12,11,8,2,11,5],
              // backgroundColor: dayColors,
              type:'line',
              order:0,
              // borderColor: "green",
              borderWidth:1,
              pointStyle:"rectRot",
              // pointRadius: 3,
              //pointHoverRadius:4,
              borderColor: "#156082",
            pointBorderColor:'#156082',
            backgroundColor: "#156082",
             
                datalabels: {
                  anchor: 'center',
                  align: 'top',
                  // offset: -18,
                  formatter: Math.round,
                  font: {
                    weight: 'bolder'
                  },
                  color:"#156082",
                  display: function(context) { // Filter out zeros
                    const value = context.dataset.data[context.dataIndex];
                    return value !== 0;
                  },
                  // ... other datalabel options (optional)
                }
             
            }
          ]
        },
        options: {
          responsive: true,
          aspectRatio: 2.0,
          scales: {
            x: {
              display: true,
              stacked:true,
              
              grid: {
                display: false,
              },
            },
            y: {
              display: true,
              // suggestedMax:SuggestedMonthMax,
              grid: {
                display: false,
              },
              ticks: {
                stepSize: 1, // Set stepSize to 1 to display only whole numbers on the y-axis
              },
            },
          },
          plugins: {
            datalabels: {
              anchor: 'center',
              align: 'center',
              // offset: -18,
              formatter: Math.round,
              font: {
              //weight: 'bolder'
              family:'Aptos Narrow',
            },
              color:"#000",
              display: function(context) { // Filter out zeros
                const value = context.dataset.data[context.dataIndex];
                return value !== 0;
              },
              // ... other datalabel options (optional)
            },
            legend: {
              display: true,
              position: 'bottom',
              align: 'center',
              labels: {
                usePointStyle: true,
                font: {
                  size: 12,
                },
                padding: 16,
                pointStyle: 'rectRounded',

              },
            },
            title: {
              text:"Action Items by Priority",
              position:"bottom",
              padding:{
                top:10
              },
              display: true,
            //  text: '   '+this.meetingChartText,
              align: 'center',
              font: {
                size: 14,
              },
            },
          },
          // elements: {
          //   // arc: {
          //   //   borderRadius: 3,
          //   //   borderWidth: 2,
          //   //   borderAlign: 'inner' // Set the border width for pie chart segments
          //   // },
          // },
        }
      });
    }

  }
  
    

  
  createpaymentTrendChart(){
    if(this.periodFilterForPriceTrend===Week){
      this.paymentTrendChart = new Chart("paymentTrendChart", {
        type: 'line',
        data: {
          labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          datasets: [
           
            {
              label: "Payment",
              data: [4,6,12,7,9,13,5],
              
                pointStyle:"rectRot",
             
              borderColor: "#156082",
              pointBorderColor:'#156082',
              backgroundColor: "#156082",
             
                datalabels: {
                  anchor: 'center',
                  align: 'top',
                  // offset: -18,
                  formatter: Math.round,
                  font: {
                    weight: 'bolder'
                  },
                  color:"#156082",
                  display: function(context) { // Filter out zeros
                    const value = context.dataset.data[context.dataIndex];
                    return value !== 0;
                  },
                  // ... other datalabel options (optional)
                }
             
            }
          ]
        },
        options: {
          responsive: true,
          aspectRatio: 2.0,
          scales: {
            x: {
              display: true,
              stacked:true,
              
              grid: {
                display: false,
              },
            },
            y: {
              display: true,
              // suggestedMax:SuggestedWeekMax,
              grid: {
                display: false,
              },
              ticks: {
                stepSize: 1, // Set stepSize to 1 to display only whole numbers on the y-axis
              },
            },
          },
          plugins: {
            datalabels: {
              anchor: 'center',
              align: 'center',
              // offset: -18,
              formatter: Math.round,
              font: {
              //weight: 'bolder'
              family:'Aptos Narrow',
            },
              color:"#000",
              display: function(context) { // Filter out zeros
                const value = context.dataset.data[context.dataIndex];
                return value !== 0;
              },
              // ... other datalabel options (optional)
            },
            legend: {
              display: true,
              position: 'bottom',
              align: 'center',
              labels: {
                usePointStyle: true,
                font: {
                  size: 12,
                },
                padding: 16,
                pointStyle: 'rectRounded',

              },
            },
            // title: {
            //   text:"Action Items by Priority",
            //   position:"bottom",
            //   padding:{
            //     top:10
            //   },
            //   display: true,
            //  text: '   '+this.meetingChartText,
            //   align: 'center',
            //   font: {
            //     size: 14,
            //   },
            // },
          },
          // elements: {
          //   // arc: {
          //   //   borderRadius: 3,
          //   //   borderWidth: 2,
          //   //   borderAlign: 'inner' // Set the border width for pie chart segments
          //   // },
          // },
        }
      });
    }else  if(this.periodFilterForPriceTrend===Month){
      this.paymentTrendChart = new Chart("paymentTrendChart", {
        type: 'line',
        data: {
          xLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
           
            {
              label: "Payment",
              data: [4,3,6,5,10,8,12,11,8,2,11,5],
           
              borderWidth:1,
              pointStyle:"rectRot",
              // pointRadius: 3,
              //pointHoverRadius:4,
              borderColor: "#156082",
         
            backgroundColor: "#156082",
             
                datalabels: {
                  anchor: 'center',
                  align: 'top',
                  // offset: -18,
                  formatter: Math.round,
                  font: {
                    weight: 'bolder'
                  },
                  color:"#156082",
                  display: function(context) { // Filter out zeros
                    const value = context.dataset.data[context.dataIndex];
                    return value !== 0;
                  },
                  // ... other datalabel options (optional)
                }
             
            }
          ]
        },
        options: {
          responsive: true,
          aspectRatio: 2.0,
          scales: {
            x: {
              display: true,
              stacked:true,
              
              grid: {
                display: false,
              },
            },
            y: {
              display: true,
              // suggestedMax:SuggestedMonthMax,
              grid: {
                display: false,
              },
              ticks: {
                stepSize: 1, // Set stepSize to 1 to display only whole numbers on the y-axis
              },
            },
          },
          plugins: {
            datalabels: {
              anchor: 'center',
              align: 'center',
              // offset: -18,
              formatter: Math.round,
              font: {
              //weight: 'bolder'
              family:'Aptos Narrow',
            },
              color:"#000",
              display: function(context) { // Filter out zeros
                const value = context.dataset.data[context.dataIndex];
                return value !== 0;
              },
              // ... other datalabel options (optional)
            },
            legend: {
              display: true,
              position: 'bottom',
              align: 'center',
              labels: {
                usePointStyle: true,
                font: {
                  size: 12,
                },
                padding: 16,
                pointStyle: 'rectRounded',

              },
            },
            title: {
              text:"Action Items by Priority",
              position:"bottom",
              padding:{
                top:10
              },
              display: true,
            //  text: '   '+this.meetingChartText,
              align: 'center',
              font: {
                size: 14,
              },
            },
          },
          // elements: {
          //   // arc: {
          //   //   borderRadius: 3,
          //   //   borderWidth: 2,
          //   //   borderAlign: 'inner' // Set the border width for pie chart segments
          //   // },
          // },
        }
      });
    }else  if(this.periodFilterForPriceTrend===Year){
      this.paymentTrendChart = new Chart("paymentTrendChart", {
        type: 'line',
        data: {
          xLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
          
            {
              label: "Total Domain",
              data: [4,3,6,5,10,8,12,11,8,2,11,5],
              // backgroundColor: dayColors,
             
              pointStyle:"rectRot",
              // pointRadius: 3,
              //pointHoverRadius:4,
              borderColor: "#156082",
            // pointBorderColor:'#156082',
            backgroundColor: "#156082",
             
                datalabels: {
                  anchor: 'center',
                  align: 'top',
                  // offset: -18,
                  formatter: Math.round,
                  font: {
                    weight: 'bolder'
                  },
                  color:"#156082",
                  display: function(context) { // Filter out zeros
                    const value = context.dataset.data[context.dataIndex];
                    return value !== 0;
                  },
                  // ... other datalabel options (optional)
                }
             
            }
          ]
        },
        options: {
          responsive: true,
          aspectRatio: 2.0,
          scales: {
            x: {
              display: true,
              stacked:true,
              
              grid: {
                display: false,
              },
            },
            y: {
              display: true,
              // suggestedMax:SuggestedMonthMax,
              grid: {
                display: false,
              },
              ticks: {
                stepSize: 1, // Set stepSize to 1 to display only whole numbers on the y-axis
              },
            },
          },
          plugins: {
            datalabels: {
              anchor: 'center',
              align: 'center',
              // offset: -18,
              formatter: Math.round,
              font: {
              //weight: 'bolder'
              family:'Aptos Narrow',
            },
              color:"#000",
              display: function(context) { // Filter out zeros
                const value = context.dataset.data[context.dataIndex];
                return value !== 0;
              },
              // ... other datalabel options (optional)
            },
            legend: {
              display: true,
              position: 'bottom',
              align: 'center',
              labels: {
                usePointStyle: true,
                font: {
                  size: 12,
                },
                padding: 16,
                pointStyle: 'rectRounded',

              },
            },
            title: {
              text:"Action Items by Priority",
              position:"bottom",
              padding:{
                top:10
              },
              display: true,
            //  text: '   '+this.meetingChartText,
              align: 'center',
              font: {
                size: 14,
              },
            },
          },
          // elements: {
          //   // arc: {
          //   //   borderRadius: 3,
          //   //   borderWidth: 2,
          //   //   borderAlign: 'inner' // Set the border width for pie chart segments
          //   // },
          // },
        }
      });
    }
  }



}
