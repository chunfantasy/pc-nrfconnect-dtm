/* Copyright (c) 2015 - 2018, Nordic Semiconductor ASA
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

import './resources/css/index.scss';

import path from 'path';

import electron from 'electron';
import {
    getAppDir,
    logger,
    startWatchingDevices,
    stopWatchingDevices,
} from 'nrfconnect/core';
import React from 'react';
import Button from 'react-bootstrap/Button';

import { deselectDevice, selectDevice } from './lib/actions/testActions';
import { clearAllWarnings, clearIncompatibleWarning, setIncompatibleWarning } from './lib/actions/warningActions';
import AppMainView from './lib/containers/appMainView';
import AppSidePanelView from './lib/containers/appSidePanelView';
import appReducer from './lib/reducers';
import { compatiblePCAs } from './lib/utils/constants';

export default {
    config: {
        selectorTraits: {
            serialport: true,
            jlink: true,
        },
        deviceSetup: {
            jprog: {
                pca10040: {
                    fw: path.resolve(getAppDir(), 'firmware/direct_test_mode_pca10040.hex'),
                    fwVersion: 'dtm-fw-1.0.0',
                    fwIdAddress: 0x6000,
                },
                pca10056: {
                    fw: path.resolve(getAppDir(), 'firmware/direct_test_mode_pca10056.hex'),
                    fwVersion: 'dtm-fw-1.0.0',
                    fwIdAddress: 0x6000,
                },
            },
        },
    },

    decorateMainView: MainView => () => (
        <MainView cssClass="main-view">
            <AppMainView />
        </MainView>
    ),

    decorateSidePanel: SidePanel => () => (
        <SidePanel>
            <AppSidePanelView cssClass="side-panel" />
        </SidePanel>
    ),

    decorateNavMenu: () => () => (
        <div className="nav-menu-wrap">
            <Button
                className="core-btn"
                variant="primary"
                onClick={() => {
                    const displayName = electron.remote.getCurrentWindow().getTitle().split('-').pop();
                    const appPath = window.location.search.split('=').pop();
                    electron.ipcRenderer.send(
                        'open-app',
                        {
                            displayName,
                            path: appPath,
                            iconPath: path.join(appPath, '/resources/icon.png'),
                        },
                    );
                }}
            >
                Select another device
            </Button>
        </div>
    ),

    mapDeviceSelectorState: (state, props) => ({
        portIndicatorStatus: (state.app.device.serialNumber !== null) ? 'on' : 'off',
        ...props,
    }),

    reduceApp: appReducer,

    middleware: store => next => action => {
        const { dispatch } = store;
        const { type, device } = action;
        switch (type) {
            case 'DEVICE_SELECTED': {
                const { serialNumber } = device;
                dispatch(clearAllWarnings());
                logger.info(`Validating firmware for device with s/n ${serialNumber}`);
                break;
            }

            case 'DEVICE_SETUP_COMPLETE': {
                const { serialport, boardVersion, serialNumber } = device;
                logger.info('Device selected successfully');
                dispatch(stopWatchingDevices());
                dispatch(selectDevice(serialport.comName, boardVersion));
                if (compatiblePCAs.indexOf(boardVersion) >= 0) {
                    dispatch(clearIncompatibleWarning());
                } else {
                    dispatch(setIncompatibleWarning(`The device with serial number \
                        ${serialNumber} is not compatible with this application.`));
                }
                break;
            }

            case 'DEVICE_DESELECTED': {
                dispatch(deselectDevice());
                dispatch(startWatchingDevices());
                dispatch(clearAllWarnings());
                break;
            }

            default:
        }

        next(action);
    },
};
