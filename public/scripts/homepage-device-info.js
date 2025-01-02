
{ // resize events
    const widthDisplay = document.getElementById('window-width');
    const heightDisplay = document.getElementById('window-height');

    const updateDimensionsDisplay = (event) => {
        widthDisplay.innerText = window.screen.width;
        heightDisplay.innerText = window.screen.height;
    };

    window.addEventListener('resize', updateDimensionsDisplay);
    updateDimensionsDisplay();
};

{ // navigator elements
    const br = () => { return document.createElement('br'); };
    const text = (s) => { return document.createTextNode(s); };
    const metric = (s) => {
        const element = document.createElement('span');

        element.className = 'yellow';

        if(!s) {
            element.innerText = '(not loaded...)';
        } else {
            element.innerText = s;
        }

        return element;
    };
    const span = (s) => {
        const element = document.createElement('span');

        element.innerText = s;

        return element;
    };

    const nav = document.getElementById('navigator-output');

    nav.innerHTML = '<u>Navigator Properties<u><br /><br />';

    if(navigator.bluetooth) {
        nav.append(metric('Browser supports Bluetooth.'));
        nav.append(br());
        nav.append(text('Bluetooth availability detected? '));

        const avail = metric();
        nav.append(avail);
        navigator.bluetooth.getAvailability().then((result) => {
            if(result) {
                avail.innerText = 'Yes';
            } else {
                avail.innerText = 'No';
            }
        });
    } else {
        nav.append(metric('Browser does not support Bluetooth.'));
    }

    nav.append(br(), br());

    if(navigator.clipboard) {
        nav.append(metric('Clipboard detected! Browser can read from and write to your clipboard!'));
        nav.append(br(), br());

        const clipbtn = document.createElement('button');
        clipbtn.innerText = 'Click here to copy a random message to your clipboard!';
        clipbtn.addEventListener('click', (event) => {
            const msg = ['We\'re in ur base', 'There\'s no rock like Norse rock', 'Clippin yr boards', 'Never gonna give you up'];

            navigator.clipboard.writeText(msg[Math.floor(Math.random() * msg.length)]).then(() => {});

            alert('Random message copied!');
        });
        nav.append(clipbtn);
        nav.append(br(), br());

        const clipbtn2 = document.createElement('button');
        clipbtn2.innerText = 'DOUBLE-click here to display some of your clipboard content below!';

        const clipContents = span('');
        clipbtn2.addEventListener('dblclick', (event) => {
            navigator.clipboard.read().then((result) => {
                clipContents.innerHTML = '';

                for(const clip of result) {
                    for(const clipType of clip.types) {
                        clip.getType(clipType)
                            .then((res) => { return res.text(); })
                            .then((clipText) => {
                                clipContents.append(span(clipText), br(), br());
                            })
                        ;
                    }
                }
            })
        });

        nav.append(clipbtn2, br(), br(), span('(if your clipboard has something other than text, the result can be unpredictable)'), br(), br(), clipContents);
    } else {
        nav.append(metric('Clipboard not detected!'));
    }

    nav.append(br(), br());

    if(navigator.connection) {
        const info = navigator.connection;

        nav.append(metric('Connection info detected!'), br(), br());
        nav.append(text('Bandwidth (estimated): '), metric(`${info.downlink} megabits per second`), br());
        nav.append(text('Connection Type (guessed from network speed): '), metric(info.effectiveType), br());
        nav.append(text('Round-trip ping (estimated): '), metric(`${info.rtt} milliseconds`), br());
        nav.append(text('Bandwidth (estimated): '), metric(`${info.downlink} megabits per second`), br());
        nav.append(text('Data saver detected?: '));

        if(info.saveData) {
            nav.append(metric('Yes'));
        } else {
            nav.append(metric('No'));
        }
    } else {
        nav.append(metric('Connection info not detected!'));
    }

    nav.append(br(), br());

    if(navigator.cookieEnabled) {
        nav.append(metric('Cookie-setting capability is currently enabled on this page.'));
    } else {
        nav.append(metric('Cookie-setting capability is currently disabled on this page.'));
    }
    nav.append(br(), text('Cookies are not being used here.'));

    nav.append(br(), br());

    if(navigator.credentials) {
        nav.append(metric('Credentials manager detected.'));
    } else {
        nav.append(metric('Credentials manager not detected.'));
    }
    nav.append(br(), text('Used to manage login needs, wherever they\'re used.'));

    nav.append(br(), br());

    nav.append(text('Device memory available to the page (approx.): '), metric(`${navigator.deviceMemory} gigabytes`));

    nav.append(br(), br());

    if(navigator.geolocation) {
        nav.append(metric('Location capability detected.'));
    } else {
        nav.append(metric('Location capability not detected.'));
    }
    nav.append(br(), text('If location is enabled, the browser can ask for permission to access your location, ' + 
        'which includes your latitude, longitude, altitude, direction & speed of travel, estimated accuracy for your location, ' + 
        'and the exact time at which your location was retrieved.')
    );

    nav.append(br(), br());

    nav.append(text('Processor cores available: '), metric(navigator.hardwareConcurrency));

    nav.append(br(), br());

    nav.append(text('Detected user language: '), metric(navigator.language));

    nav.append(br(), br());

    nav.append(text('Detected user languages, in order of preference:'));
    const langs = navigator.languages;
    for(const lang of langs) {
        nav.append(br(), metric(lang));
    }

    nav.append(br(), br());

    if(navigator.locks) {
        nav.append(metric('Web locks detected.'));
    } else {
        nav.append(metric('Web locks not detected.'));
    }
    nav.append(br(), text('Web locks are used to lock down Web page processes so that other processes can\'t interrupt while they\'re at work, unless the user intervenes.'));

    nav.append(br(), br());

    nav.append(text('Number of touch inputs that this device can detect at any one time: '), metric(navigator.maxTouchPoints));

    nav.append(br(), br());

    if(navigator.mediaCapabilities) {
        nav.append(metric('Media capabilities interface detected.'));
    } else {
        nav.append(metric('Media capabilities interface  not detected.'));
    }
    nav.append(br(), text('The media capabilities interface is used to determine whether the browser can handle playing a piece of media.'));

    nav.append(br(), br());

    if(navigator.mediaDevices) {
        nav.append(metric('Media devices capability detected.'));

        const devicesReadout = span('');
        navigator.mediaDevices.enumerateDevices().then((deviceInfo) => {
            devicesReadout.innerHTML = '';

            for(const device of deviceInfo) {
                devicesReadout.append(br(), br());
                devicesReadout.append(text('Device ID: '), metric(device.deviceId));
                devicesReadout.append(br(), text('Physical device: '), metric(device.groupId));
                devicesReadout.append(br(), text('Device type: '), metric(device.kind));
                devicesReadout.append(br(), text('Detected device label: '), metric(device.label));
            }
        });

        nav.append(devicesReadout);
    } else {
        nav.append(metric('Media devices capability not detected.'));
    }

    nav.append(br(), br());

    if(navigator.mediaSession) {
        nav.append(metric('Media session interface detected.'));
    } else {
        nav.append(metric('Media session interface not detected.'));
    }
    nav.append(br(), text('The media session interface is used to retrieve information about a playing piece of media, such as a title or artist name.'));

    nav.append(br(), br());

    if(navigator.onLine) {
        nav.append(metric('Online browsing detected.'));
    } else {
        nav.append(metric('Offline browsing detected.'));
    }

    nav.append(br(), br());

    if(navigator.pdfViewerEnabled) {
        nav.append(metric('PDF viewer is enabled for this browser.'));
    } else {
        nav.append(metric('There is no PDF viewer enabled for this browser.'));
    }

    nav.append(br(), br());

    if(navigator.permissions) {
        nav.append(metric('Permissions interface detected.'));
    } else {
        nav.append(metric('Permissions interface not detected.'));
    }
    nav.append(br(), text('The permissions interface is used to keep track of permissions that have been granted by the user, such as location, camera, and microphone.'));

    nav.append(br(), br());

    if(navigator.presentation) {
        nav.append(metric('Presentation interface detected.'));
    } else {
        nav.append(metric('Presentation interface not detected.'));
    }
    nav.append(br(), text('The presentation interface handles receiving & controlling presentation materials across browsers & devices.'));

    nav.append(br(), br());

    if(navigator.serviceWorker) {
        nav.append(metric('Service workers enabled.'));
    } else {
        nav.append(metric('Service worker not enabled.'));
    }
    nav.append(br(), text('A service worker is a bit of software that sits between the front end and the server, so that when they load a Web resource, ' + 
        'the service worker can control if that resource comes from the back end server, from a resource that\'s saved to local memory, or elsewhere. ' +
        'Usually used to allow a page to function while offline. Can also carry out some other script functions. Only runs over HTTPS.'))
    ;

    nav.append(br(), br());

    if(navigator.storage) {
        nav.append(metric('Storage manager enabled.'));

        nav.append(br(), br(), text('Device storage available to the site (approx.): '));

        const quota = metric();
        const usage = metric();

        navigator.storage.estimate().then((estimate) => {
            quota.innerText = estimate.quota + ' bytes';
            usage.innerText = estimate.usage + ' bytes';
        });

        nav.append(quota);

        nav.append(br(), text('Device storage being used by the site (approx.): ', usage));

        nav.append(br(), text('Site is able to use persistent navigator storage across visits?: '));

        const persist = metric();
        navigator.storage.persist().then((res) => {
            if(res) {
                persist.innerText = 'Yes';
            } else {
                persist.innerText = 'No';
            }
        });
        nav.append(persist);

        nav.append(br(), text('Site has permission to use persistent navigator storage?: '));

        const persisted = metric();
        navigator.storage.persisted().then((res) => {
            if(res) {
                persisted.innerText = 'Yes';
            } else {
                persisted.innerText = 'No';
            }
        });
        nav.append(persisted);
    } else {
        nav.append(metric('Storage manager not enabled.'));
    }

    nav.append(br(), br());

    if(navigator.usb) {
        nav.append(metric('USB capability detected.'));
    } else {
        nav.append(metric('USB capability not detected.'));
    }

    nav.append(br(), br());

    if(navigator.userActivation) {
        nav.append(metric('User activation capability detected.'));
    } else {
        nav.append(metric('User activation capability not detected.'));
    }
    nav.append(br(), text('User activation allows the site to detect whether the user has interacted with or is interacting with the page, ' + 
        'such as by clicking a button or checking a box.'))
    ;

    nav.append(br(), br());

    if(navigator.userAgent) {
        nav.append(metric('User agent detected.'));

        nav.append(br(), br(), text('User agent given by the browser: '), metric(navigator.userAgent));
    } else {
        nav.append(metric('User agent not detected.'));
    }
    nav.append(br(), text('User agent is a basic bit of text that can be given from the browser, and its default value may identify the type of browser.'));

    nav.append(br(), br());

    if(navigator.wakeLock) {
        nav.append(metric('Wake lock capability detected.'));
    } else {
        nav.append(metric('Wake lock capability not detected.'));
    }
    nav.append(br(), text('Wake lock allows the site to request that the screen doesn\'t turn off or dim. Site requests to use this feature may be ' + 
        'rejected by the local system, such as when device battery is low.'))
    ;

    nav.append(br(), br());

    if(navigator.webdriver) {
        nav.append(metric('Webdriver detected.'));
    } else if(navigator.webdriver === false) {
        nav.append(metric('Webdriver capability is on, but webdriver is not detected.'));
    } else {
        nav.append(metric('Webdriver capability not detected.'));
    }
    nav.append(br(), text('Webdriver is a flag from the browser indicating whether it is being controlled through automation tools (i.e., by a bot).'));

    nav.append(br(), br());

    if(navigator.windowControlsOverlay) {
        nav.append(metric('Window controls overlay interface detected.'));
    } else {
        nav.append(metric('Window controls overlay interface not detected.'));
    }
    nav.append(br(), text('The window controls overlay interface allows only a Progressive Web App, not a regular website, to detect and modify the ' + 
        'presentation of the basic window controls such as the maximize and close buttons.'))
    ;
};
