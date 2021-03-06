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

import { createSlice } from '@reduxjs/toolkit';
import { DTM } from 'nrf-dtm-js/src/DTM';
import { bleChannels } from 'pc-nrfconnect-shared';

import * as Constants from '../utils/constants';
import { RootState, SettingsState } from './types';

export const DTM_CHANNEL_MODE = {
    single: 'DTM_CHANNEL_MODE_SINGLE_ACTION',
    sweep: 'DTM_CHANNEL_MODE_SWEEP_ACTION',
};

const initialState: SettingsState = {
    channelMode: DTM_CHANNEL_MODE.single,
    singleChannel: 19,
    channelRange: [bleChannels.min, bleChannels.max],
    sweepTime: 0,
    bitpattern: 0,
    length: 37,
    txPower: Math.max(0, Constants.dbmValues.indexOf(0)),
    phy: DTM.DTM_PARAMETER.PHY_LE_1M,
    modulationMode: DTM.DTM_PARAMETER.STANDARD_MODULATION_INDEX,
    timeoutms: 0,
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        dtmChannelModeChanged(state, action) {
            state.channelMode = action.payload;
        },
        dtmSingleChannelChanged(state, action) {
            state.singleChannel = action.payload;
        },
        channelRangeChanged(state, action) {
            state.channelRange = action.payload;
        },
        sweepTimeChanged(state, action) {
            state.sweepTime = action.payload;
        },
        txPowerChanged(state, action) {
            state.txPower = action.payload;
        },
        bitpatternChanged(state, action) {
            state.bitpattern = action.payload;
        },
        lengthChanged(state, action) {
            state.length = action.payload;
        },
        timeoutChanged(state, action) {
            state.timeoutms = action.payload * 1000;
        },
        phyChanged(state, action) {
            state.phy = action.payload;
        },
        modulationChanged(state, action) {
            state.modulationMode = action.payload;
        },
    },
});

export default settingsSlice.reducer;

const {
    dtmChannelModeChanged,
    dtmSingleChannelChanged,
    channelRangeChanged,
    sweepTimeChanged,
    txPowerChanged,
    bitpatternChanged,
    lengthChanged,
    timeoutChanged,
    phyChanged,
    modulationChanged,
} = settingsSlice.actions;

const getChannelMode = (state: RootState) => state.app.settings.channelMode;
const getSingleChannel = (state: RootState) => state.app.settings.singleChannel;
const getChannelRange = (state: RootState) => state.app.settings.channelRange;
const getSweepTime = (state: RootState) => state.app.settings.sweepTime;
const getBitpattern = (state: RootState) => state.app.settings.bitpattern;
const getLength = (state: RootState) => state.app.settings.length;
const getTxPower = (state: RootState) => state.app.settings.txPower;
const getPhy = (state: RootState) => state.app.settings.phy;
const getModulation = (state: RootState) => state.app.settings.modulationMode;
const getTimeout = (state: RootState) => state.app.settings.timeoutms;

export {
    dtmChannelModeChanged,
    dtmSingleChannelChanged,
    channelRangeChanged,
    sweepTimeChanged,
    txPowerChanged,
    bitpatternChanged,
    lengthChanged,
    timeoutChanged,
    phyChanged,
    modulationChanged,
    getChannelMode,
    getSingleChannel,
    getChannelRange,
    getSweepTime,
    getBitpattern,
    getLength,
    getTxPower,
    getPhy,
    getModulation,
    getTimeout,
};
