/* Copyright (c) 2015 - 2021, Nordic Semiconductor ASA
 *
 * All rights reserved.
 *
 * Use in source and binary forms, redistribution in binary form only, with
 * or without modification, are permitted provided that the following conditions
 * are met:
 *
 * 1. Redistributions in binary form, except as embedded into a Nordic
 *    Semiconductor ASA integrated circuit in a product or a software update for
 *    such product, must reproduce the above copyright notice, this list of
 *    conditions and the following disclaimer in the documentation and/or other
 *    materials provided with the distribution.
 *
 * 2. Neither the name of Nordic Semiconductor ASA nor the names of its
 *    contributors may be used to endorse or promote products derived from this
 *    software without specific prior written permission.
 *
 * 3. This software, with or without modification, must only be used with a Nordic
 *    Semiconductor ASA integrated circuit.
 *
 * 4. Any software provided in binary form under this license must not be reverse
 *    engineered, decompiled, modified and/or disassembled.
 *
 * THIS SOFTWARE IS PROVIDED BY NORDIC SEMICONDUCTOR ASA "AS IS" AND ANY EXPRESS OR
 * IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY, NONINFRINGEMENT, AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL NORDIC SEMICONDUCTOR ASA OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
 * TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { bleChannels } from 'pc-nrfconnect-shared';

import { getIsRunning, getLastReceived } from '../reducers/testReducer';
import chartColors from '../utils/chartColors';

Chart.plugins.register(ChartDataLabels);

const FREQUENCY_BASE = 2402;
const FREQUENCY_INTERVAL = 2;

const bleChannelsUpdated = bleChannels.map(
    (channel, index) =>
        `${channel} | ${FREQUENCY_BASE + index * FREQUENCY_INTERVAL} MHz`
);

const ChartView = () => {
    const lastReceived = useSelector(getLastReceived);
    const isRunning = useSelector(getIsRunning);
    const [maxY, setMaxY] = useState(0);

    useEffect(() => {
        if (isRunning) setMaxY(10);
    }, [isRunning]);

    return (
        <Bar
            data={{
                labels: bleChannelsUpdated,
                datasets: [
                    {
                        label: 'Received packets',
                        data: [...lastReceived],
                        backgroundColor: chartColors.bar,
                        borderColor: chartColors.bar,
                        borderWidth: 1,
                        hoverBackgroundColor: chartColors.bar,
                        hoverBorderColor: chartColors.bar,
                        datalabels: {
                            color: chartColors.bar,
                            anchor: 'end',
                            align: 'end',
                            formatter: (v: number) => (v <= 0 ? '' : v),
                            offset: -3,
                            font: { size: 9 },
                        },
                    },
                    {
                        label: 'bgBars',
                        backgroundColor: chartColors.background,
                        borderWidth: 0,
                        data: Array(bleChannelsUpdated.length).fill(maxY),
                        datalabels: { display: false },
                    },
                ],
            }}
            options={{
                maintainAspectRatio: false,
                legend: { display: false },
                tooltips: { enabled: false },
                animation: undefined,
                scales: {
                    yAxes: [
                        {
                            ticks: {
                                min: undefined,
                                max: undefined,
                                suggestedMin: 0,
                                suggestedMax: 10,
                                stepSize: undefined,
                                callback: (
                                    value: number,
                                    _: unknown,
                                    values: number[]
                                ) => {
                                    setMaxY(values[0]);
                                    return value;
                                },
                                fontColor: chartColors.label,
                            },
                            scaleLabel: {
                                display: true,
                                labelString: 'Received packets',
                                fontColor: chartColors.label,
                                fontSize: 14,
                            },
                            gridLines: {
                                display: false,
                                drawBorder: false,
                            },
                        },
                    ],
                    xAxes: [
                        {
                            type: 'category',
                            position: 'top',
                            offset: true,
                            stacked: true,
                            gridLines: {
                                display: false,
                            },
                            ticks: {
                                callback: (_: unknown, index: number) =>
                                    String(bleChannels[index]).padStart(2, '0'),
                                minRotation: 0,
                                maxRotation: 0,
                                labelOffset: 0,
                                autoSkipPadding: 5,
                                fontColor: chartColors.label,
                            },
                            scaleLabel: {
                                display: true,
                                labelString: 'BLE channel',
                                fontColor: chartColors.label,
                                fontSize: 14,
                            },
                        },
                        {
                            type: 'category',
                            position: 'bottom',
                            offset: true,
                            stacked: true,
                            gridLines: {
                                offsetGridLines: true,
                                display: false,
                                drawBorder: false,
                            },
                            ticks: {
                                callback: (_: unknown, index: number) =>
                                    FREQUENCY_BASE + index * FREQUENCY_INTERVAL,
                                minRotation: 90,
                                labelOffset: 0,
                                autoSkipPadding: 5,
                                fontColor: chartColors.label,
                            },
                            scaleLabel: {
                                display: true,
                                labelString: 'MHz',
                                fontColor: chartColors.label,
                                fontSize: 14,
                                padding: { top: 10 },
                            },
                        },
                    ],
                },
            }}
            width={600}
            height={250}
        />
    );
};

export default ChartView;
