import { Component, OnInit, ViewChild } from '@angular/core';
import { RegistrarDashboardServiceService } from './service/registrar-dashboard-service.service';
import { Chart, BarController, BarElement, LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { error } from 'jquery';
import { OrganisationDetailsService } from '../organisation-details/service/organisation-details.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { lastValueFrom } from 'rxjs';
import { DomainService } from '../rgnt-domain/service/domain.service';
import { HttpStatusCode } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../user/service/user.service';


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
  

  periodFiltersApplication:string=Month
  periodFilterForApplicationStatus:string=Month
  applicationStatusChart:any;
  applicationChart:any;
  applicationYearLabel:any[]=[];
  TotalDomainForWeek:any[]=[]
  TotalDomainForMonth:any[]=[]
  TotalDomainForYear:any[]=[]
  TotalApplicationStatusForYear:any[]=[];
  TotalApplicationStatusForMonth:any[]=[];
  TotalApplicationStatusForWeek:any[]=[];
  totalRegistrants:number=0
  totalDomains:number=0
  applicationInQueue:number=0
  revenueCollected:number=0
  
  displayedApplicationInQueue: string[] = [
    // 'checkbox',
    'domainId',
    'domainName',
    'orgName',
    'regDate',
    'renewalDate',
    'status',
  ]; // Matches matColumnDef values

  applicationQueData: any[] = [];
  applicationInQueueDataSourse: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private registrarDashboardService:RegistrarDashboardServiceService,private organisationService:OrganisationDetailsService,private domainService:DomainService,
    private router:Router,private userService:UserService){
    this.applicationInQueueDataSourse = new MatTableDataSource<any>();
  }
  ngOnInit(): void {
    this.fetchDataForTopCards();
    this.fetchDataForDomainRegistration('email');
    this.fetchDataForApplicationStatus();
    this.fetchDataForApplicationInQueue("");
  }

  fetchDataForTopCards(){
     this.getAllOrg();
     this.getDomainDetails();
     this.getAllActiveUsers();
  }
  getAllOrg(){
    this.organisationService.getAllOrganisations().subscribe({
      next: response=>{
        // console.log(response)
        this.totalRegistrants=response.body.length;
      },error:error=>{

      }
    })
  }
  allActiveUsersCount:number=0
  getAllActiveUsers(){
    this.userService.getAllActiveUsers().subscribe({
      next: response=>{
        // console.log(response)
        this.allActiveUsersCount=response.body;
      },error:error=>{

      }
    })
  }
  getDomainDetails(){
    this.registrarDashboardService.getDomainCount().subscribe({
      next:response=>{
        console.log(response)
        this.totalDomains=response.body[0];
        this.applicationInQueue=response.body[1];
      },error:error=>{

      }
    })
  }
  fetchDataForDomainRegistration(emailIds) {
    if(this.applicationChart!=null){
      this.applicationChart.destroy();
    }
    
    if (this.periodFiltersApplication === Week) {
      const currentDate = new Date();
      const startDate = new Date(currentDate);
      startDate.setHours(0, 0, 0, 0);
      
      // Set the start date to the beginning of the current week (Sunday)
      startDate.setDate(currentDate.getDate() - currentDate.getDay());
      
      const endDate = new Date(startDate);
      // Set the end date to the end of the current week (Saturday)
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
      
      console.log('Start Date:', startDate.toISOString());
      console.log('End Date:', endDate.toISOString());
      this.registrarDashboardService.fetchDomainStatusforWeek(startDate.toISOString(), endDate.toISOString()).subscribe({
        next: response => {
          this.TotalDomainForWeek = response.body;
          console.log(this.TotalDomainForWeek)
          this.createDomainTrendChart();

        }
      })
    } else if (this.periodFiltersApplication === Month) {
      if (this.applicationChart != null) {
        this.applicationChart.destroy();
      }
      const startDate = new Date();
      const endDate = new Date();

      startDate.setFullYear(new Date().getFullYear(), 0, 1);
      endDate.setFullYear(new Date().getFullYear(), 11, 31);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      this.registrarDashboardService.fetchDomainStatusforMonth(startDate.toISOString(), endDate.toISOString()).subscribe({
        next: response => {
          this.TotalDomainForMonth = response.body;
          this.createDomainTrendChart();
        }
      })


    }
    else if (this.periodFiltersApplication === Year) {
      if (this.applicationChart != null) {
        this.applicationChart.destroy();
      }
      this.applicationYearLabel=[]
      const currentYear = new Date().getFullYear();
      const baseYear = currentYear - 4;
      const startDate = new Date(baseYear, 0, 1);
      const endDate = new Date(currentYear + 1, 11, 31);
      
      // Set times to 00:00:00 for start and 23:59:59.999 for end (optional)
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      console.log(startDate+"  "+endDate)

      // Iterate from base year to current year and add to array
      for (let year = baseYear; year <= currentYear+1; year++) {
        this.applicationYearLabel.push(year);
      }
      this.registrarDashboardService.fetchDomainStatusforYear(startDate.toISOString(), endDate.toISOString()).subscribe({
        next: response => {
          this.TotalDomainForYear = response.body;
          this.createDomainTrendChart();
        }
      })


    }


  }
  fetchDataForApplicationStatus(){
    if(this.applicationStatusChart!=null){
      this.applicationStatusChart.destroy();
    }
    if (this.periodFilterForApplicationStatus === Week) {
      const currentDate = new Date();
      const startDate = new Date(currentDate);
      startDate.setHours(0, 0, 0, 0);
      
      // Set the start date to the beginning of the current week (Sunday)
      startDate.setDate(currentDate.getDate() - currentDate.getDay());
      
      const endDate = new Date(startDate);
      // Set the end date to the end of the current week (Saturday)
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
      
      console.log('Start Date:', startDate.toISOString());
      console.log('End Date:', endDate.toISOString());
      this.registrarDashboardService.fetchApplicationStatusforWeek(startDate.toISOString(), endDate.toISOString()).subscribe({
        next: response => {
          this.TotalApplicationStatusForWeek = response.body;
          console.log(this.TotalApplicationStatusForWeek)
          this.createApplicationStatusChart();

        }
      })
    } else if (this.periodFilterForApplicationStatus === Month) {
      if (this.applicationStatusChart != null) {
        this.applicationStatusChart.destroy();
      }
      const startDate = new Date();
      const endDate = new Date();

      startDate.setFullYear(new Date().getFullYear(), 0, 1);
      endDate.setFullYear(new Date().getFullYear(), 11, 31);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      this.registrarDashboardService.fetchApplicationStatusforMonth(startDate.toISOString(), endDate.toISOString()).subscribe({
        next: response => {
          this.TotalApplicationStatusForMonth = response.body;
          console.log(this.TotalApplicationStatusForMonth)
          this.createApplicationStatusChart();
        }
      })


    }
    else if (this.periodFilterForApplicationStatus === Year) {
      if (this.applicationStatusChart != null) {
        this.applicationStatusChart.destroy();
      }
      this.applicationYearLabel=[]
      const currentYear = new Date().getFullYear();
      const baseYear = currentYear - 4;
      const startDate = new Date(baseYear, 0, 1);
      const endDate = new Date(currentYear + 1, 11, 31);
      
      // Set times to 00:00:00 for start and 23:59:59.999 for end (optional)
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      console.log(startDate+"  "+endDate)

      // Iterate from base year to current year and add to array
      for (let year = baseYear; year <= currentYear+1; year++) {
        this.applicationYearLabel.push(year);
      }
      this.registrarDashboardService.fetchApplicationStatusforYear(startDate.toISOString(), endDate.toISOString()).subscribe({
        next: response => {
          this.TotalApplicationStatusForYear = response.body;
          console.log(this.TotalApplicationStatusForYear)
          this.createApplicationStatusChart();
        }
      })


    }
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
              data: this.TotalDomainForWeek[0],
              backgroundColor: '#F2AA86',
              // backgroundColor: dayColors,
              barPercentage: 0.8,
              stack:'Stack 0',
              order:1
            },
            {
              label: ".bank.in",
              data: this.TotalDomainForWeek[1],
              // backgroundColor: dayColors,
              backgroundColor:' #9EDEF8',
              barPercentage: 0.8,
              stack:'Stack 0',
              order:1
            },
            {
              label: "Total Domain",
              data: this.TotalDomainForWeek[2],
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
          aspectRatio: 1.0,
          maintainAspectRatio:false,
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
              data:  this.TotalDomainForMonth[0],
              backgroundColor: '#F2AA86',
              // backgroundColor: dayColors,
              barPercentage: 0.8,
              stack:'Stack 0',
              order:1
            },
            {
              label: ".bank.in",
              data: this.TotalDomainForMonth[1],
              // backgroundColor: dayColors,
              backgroundColor:'#9EDEF8',
              barPercentage: 0.8,
              stack:'Stack 0',
              order:1
            },
            {
              label: "Total Domain",
              data: this.TotalDomainForMonth[2],
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
          aspectRatio: 1.0,
          maintainAspectRatio:false,
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
          labels: this.applicationYearLabel,
          datasets: [
            {
              label: ".fin.in",
              data:  this.TotalDomainForYear[0],
              backgroundColor: '#F2AA86',
              // backgroundColor: dayColors,
              barPercentage: 0.8,
              stack:'Stack 0',
              order:1
            },
            {
              label: ".bank.in",
              data: this.TotalDomainForYear[1],
              // backgroundColor: dayColors,
              backgroundColor:'#9EDEF8',
              barPercentage: 0.8,
              stack:'Stack 0',
              order:1
            },
            {
              label: "Total Domain",
              data: this.TotalDomainForYear[2],
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
          aspectRatio: 1.0,
          maintainAspectRatio:false,
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
  
    

  
  createApplicationStatusChart(){
    if(this.periodFilterForApplicationStatus===Week){
      this.applicationStatusChart = new Chart("applicationStatusChart", {
        type: 'bar',
        data: {
          labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          datasets: [
            {
              label: "Accepted",
              data: this.TotalApplicationStatusForWeek[0],
              backgroundColor: '#F2AA86',
              // backgroundColor: dayColors,
              barPercentage: 0.8,
              stack:'Stack 0',
              order:1
            },
            {
              label: "Pending",
              data: this.TotalApplicationStatusForWeek[1],
              // backgroundColor: dayColors,
              backgroundColor:' #9EDEF8',
              barPercentage: 0.8,
              stack:'Stack 0',
              order:1
            },
            {
              label: "Rejected",
              data: this.TotalApplicationStatusForWeek[2],
              barPercentage: 0.8,
             // pointRadius: 3,
              //pointHoverRadius:4,
              backgroundColor: "#156082",
              stack:'Stack 0',
              order:1
            }
          ]
        },
        options: {
          responsive: true,
          aspectRatio: 1.0,
          maintainAspectRatio:false,
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
    }else  if(this.periodFilterForApplicationStatus===Month){
      this.applicationStatusChart = new Chart("applicationStatusChart", {
        type: 'bar',
        data: {
          xLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: "Accepted",
              data:  this.TotalApplicationStatusForMonth[0],
              backgroundColor: '#F2AA86',
              // backgroundColor: dayColors,
              barPercentage: 0.8,
              stack:'Stack 0',
              order:1
            },
            {
              label: "Pending",
              data: this.TotalApplicationStatusForMonth[1],
              // backgroundColor: dayColors,
              backgroundColor:'#9EDEF8',
              barPercentage: 0.8,
              stack:'Stack 0',
              order:1
            },
            {
              label: "Rejected",
              data: this.TotalApplicationStatusForMonth[2],
              // backgroundColor: dayColors,
              backgroundColor:'#156082',
              barPercentage: 0.8,
              stack:'Stack 0',
              order:1
            }
          ]
        },
        options: {
          responsive: true,
          aspectRatio: 1.0,
          maintainAspectRatio:false,
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
    }else  if(this.periodFilterForApplicationStatus===Year){
      this.applicationStatusChart = new Chart("applicationStatusChart", {
        type: 'bar',
        data: {
          labels:this.applicationYearLabel,
          datasets: [
            {
              label: "Accepted",
              data:  this.TotalApplicationStatusForYear[0],
              backgroundColor: '#F2AA86',
              // backgroundColor: dayColors,
              barPercentage: 0.8,
              stack:'Stack 0',
              order:1
            },
            {
              label: "Pending",
              data: this.TotalApplicationStatusForYear[1],
              // backgroundColor: dayColors,
              backgroundColor:'#9EDEF8',
              barPercentage: 0.8,
              stack:'Stack 0',
              order:1
            },
            {
              label: "Rejected",
              data: this.TotalApplicationStatusForYear[2],
              // backgroundColor: dayColors,
              barPercentage: 0.8,
              backgroundColor: "#156082",
              stack:'Stack 0',
              order:1
            }
          ]
        },
        options: {
          responsive: true,
          aspectRatio: 1.0,
          maintainAspectRatio:false,
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

    async fetchDataForApplicationInQueue(userId){
     
        await lastValueFrom(this.domainService.getAllApplicationInQueue()).then(
          (response) => {
            if (response.status === HttpStatusCode.Ok) {
              this.applicationQueData = response.body;
              console.log(this.applicationQueData)
              this.applicationInQueueDataSourse.data = this.applicationQueData;
              setTimeout(() => {
                this.applicationInQueueDataSourse.sort = this.sort;
                this.applicationInQueueDataSourse.paginator = this.paginator;
              }, 0);
            }
          },
          (error) => {
            if (error.status === HttpStatusCode.Unauthorized) {
              this.navigateToSessionTimeout();
            }
          }
        );
      }

      navigateToSessionTimeout() {
        this.router.navigateByUrl('/session-timeout');
      }
    }


