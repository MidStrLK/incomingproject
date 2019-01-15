import { Component }            from '@angular/core'
import { HttpClient}            from '@angular/common/http';

import { InteractionService }   from '../../interaction/interaction.service';
import { StatusService }        from '../../shared/status.service';
import { AuthService }          from '../../shared/auth.service';
import { GoogleCharts }         from 'google-charts';

@Component({
    selector:      'info-place',
    templateUrl: './info.component.html',
    styleUrls:  ['./info.component.css']
})
export class InfoPlaceComponent {
    status: any = {
        username: '',
        userrole: ''
    };
    leftArray:any[] = [
        {
            label: 'Заявок в этом году',
            count: 123
        }, {
            label: 'Заявок в этом месяце',
            count: 36
        }, {
            label: 'Заявок на этой неделе',
            count: 12
        }, {
            label: 'Заявок сегодня',
            count: 5
        }, {
            label: 'План на неделю',
            count: 15
        }
    ];
    rightArray:any[] = [
        {
            label: 'Туристов отправлено в этом году',
            count: 247
        }, {
            label: 'Туристов отправлено в этом месяце',
            count: 110
        }, {
            label: 'Туристов отправлено на этой неделе',
            count: 25
        }, {
            label: 'Туристов отправлено сегодня',
            count: 6
        }, {
            label: 'Довольных туристов',
            count: 2
        }];

    constructor(private  auth:AuthService,
                private  statusS:StatusService) {

        statusS.getStatus(data => this.status = data);

        //if (status && status.status && status.status['username']) this.currentUser = status.status['username'];
        //if (status && status.status && status.status['userrole']) this.userRole = status.status['userrole'];

        GoogleCharts.load(() => this.drawChart('chart-left'));
        GoogleCharts.load(() => this.drawGeoChart('chart-right'));
    }

    onExitClick() {
        this.auth.logout();
    }

    drawChart(elem) {

        // Standard google charts functionality is available as GoogleCharts.api after load
        const data = GoogleCharts.api.visualization.arrayToDataTable([
            ['Chart thing', 'Chart amount'],
            ['Оплатили тур', 60],
            ['Отказались от тура', 22],
            ['Непонятно', 18]
        ]);

        const options = {
            colors: ['#303F9F', '#3F51B5', '#C5CAE9']
        };

        const pie_1_chart = new GoogleCharts.api.visualization.PieChart(document.getElementById(elem));
        pie_1_chart.draw(data/*, options*/);
    }

    drawGeoChart(elem) {

        const col_1_data = GoogleCharts.api.visualization.arrayToDataTable([
            ['Туристов', 'Пришли', 'Заинтересовались', 'Купили'],
            ['Понедельник', 22, 10,  5],
            ['Вторник', 10, 15, 11],
            ['Среда', 5,   3,  1],
            ['Четверг', 15, 11,  7],
            ['Пятница', 19, 11,  5],
            ['Суббота', 3,   1,  0],
            ['Воскресенье', 30, 22, 12],
        ]);

        const col_1_options = {
            legend: {
                position: 'bottom',
                textStyle: {
                    color: 'black',
                    fontSize: 13,
                    fontName: 'EncodeSans'
                }
            },
            bar: {groupWidth: '75%'},
            //colors: ['#303F9F', '#3F51B5', '#C5CAE9'],
            isStacked: true,
            chartArea: {left: 0, top: 0, width: '100%', height: '80%'},
            axisTitlesPosition: 'none',
            hAxis: {textPosition: 'Туристы', gridlines: {color: 'transparent'}, baselineColor: 'transparent'},
            vAxis: {textPosition: 'Дни недели', gridlines: {color: 'transparent'}, baselineColor: 'transparent'},
        };

        const col_1_chart = new GoogleCharts.api.visualization.ColumnChart(document.getElementById(elem));
        col_1_chart.draw(col_1_data/*, col_1_options*/);
    }

}
