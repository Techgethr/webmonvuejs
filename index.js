// Creator: Néstor Campos (https://github.com/nescampos) and Techgethr (https://github.com/Techgethr)
// Version: 1.0

import Vue from 'vue'

const optionsDefaults = {
    isBrowserEnabled() {
        if (document.monetization === undefined) {
            return false;
        }
        else {
            return true;
        }
    },
    getMonetizationState() {
        if (this.isBrowserEnabled()) {
            return document.monetization.state;
        }
        else {
            return "Not enabled in this browser";
        }
    },
    registerMonetizedContent(classExclusiveContent, classHiddenContent){
        this.classExclusiveContent = classExclusiveContent;
        this.classHiddenContent = classHiddenContent;
    },
    start(pointer,callbackFunction) {
        if(pointer === null || pointer === undefined) {
            throw new ReferenceError("pointer is required");
        }
        const monetizationTag = document.querySelector('meta[name="monetization"]');
        if (!monetizationTag) {
            var meta = document.createElement('meta');
            meta.name = "monetization";
            this.pointer = pointer;
            meta.content = pointer;
            document.getElementsByTagName('head')[0].appendChild(meta);
            if(this.isBrowserEnabled()){
                if(this.classExclusiveContent){
                    document.monetization.addEventListener('monetizationstart', () => {
                        document.getElementsByClassName(this.classExclusiveContent).classList.remove(this.classHiddenContent)
                      });
                    document.monetization.addEventListener('monetizationstop', () => {
                        document.getElementsByClassName(this.classExclusiveContent).classList.add(this.classHiddenContent)
                      });
                }
                
                document.monetization.addEventListener('monetizationprogress',  ev => {
                    if (this.total === 0) {
                        this.scale = ev.detail.assetScale;
                        this.assetCode = ev.detail.assetCode;
                    }
                    this.total += Number(ev.detail.amount);
                  });
            }
            
        }
        if(callbackFunction){
            callbackFunction();
        }
    },
    isPendingState() {
        return this.isBrowserEnabled() && document.monetization.state === 'pending';
    },
    isStartedState() {
        return this.isBrowserEnabled() && document.monetization.state === 'started';
    },
    isStoppedState() {
        return this.isBrowserEnabled() && document.monetization.state === 'stopped';
    },
    isUndefinedState() {
        return document.monetization === undefined;
    },
    changePointer(pointer, createIfNotExist = false,callbackFunction) {
        if(pointer === null || pointer === undefined) {
            throw new ReferenceError("pointer is required");
        }

        const monetizationTag = document.querySelector('meta[name="monetization"]');
        if (monetizationTag) {
            this.pointer = pointer;
            monetizationTag.content = pointer;
            if(callbackFunction){
                callbackFunction();
            }
        }
        else {
            if(createIfNotExist) {
                this.start(pointer,callbackFunction);
            }
        }
    },
    registerStartListener(listenerFunction) {
        if (this.isBrowserEnabled()) {
            document.monetization.addEventListener('monetizationstart', () => {
                listenerFunction()
            });
        }
    },
    registerProgressListener(listenerFunction) {
        if (this.isBrowserEnabled()) {
            document.monetization.addEventListener('monetizationprogress',  ev => {
                listenerFunction();
              });
              
        }
    },
    getTotalAmountFromCurrentUser(){
        return this.total;
    },
    getScaleFromCurrentUser(){
        return this.scale;
    },
    getCurrentPointer(){
        return this.pointer;
    },
    getAssetCodeFromCurrentUser(){
        return this.assetCode;
    },
    registerStopListener(listenerFunction) {
        if (this.isBrowserEnabled()) {
            document.monetization.addEventListener('monetizationstop', () => {
                listenerFunction()
            });
        }
    },
    registerPendingListener(listenerFunction) {
        if (this.isBrowserEnabled()) {
            document.monetization.addEventListener('monetizationpending', () => {
                listenerFunction()
            });
        }
    },
    executeOnUndefined(callbackFunction) {
        if (this.isUndefinedState()) {
            callbackFunction();
        }
    },
    stop(callbackFunction) {
        const monetizationTag = document.querySelector('meta[name="monetization"]')
        if (monetizationTag) {
            monetizationTag.remove();

            if(callbackFunction){
                callbackFunction();
            }
        }
    },
    data: {
        total = 0,
        scale = 0,
        assetCode = null,
        classExclusiveContent = null,
        classHiddenContent = null,
        pointer = null
    }
}

export default {
    install(vue, opts){   
        console.log('Installing the WebMonetization Helper plugin!')
        const options = { ...optionsDefaults, ...opts }

        // Create plugin's root Vue instance
        const root = new Vue({
            data: { total = 0,scale = 0,assetCode = null,classExclusiveContent = null,classHiddenContent = null,pointer = null }
        })

        // Make the root instance available in all components
        vue.prototype.$webmonetization = root
    }
}