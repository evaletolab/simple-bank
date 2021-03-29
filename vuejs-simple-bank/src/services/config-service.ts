import Vue from "vue";
import axios from 'axios';

const defaultAxios = {
  headers: { 'Cache-Control': 'no-cache' }
};

class ConfigService {
  // More about store
  // https://fr.vuejs.org/v2/guide/reactivity.html
  private _store: any;
  private _baseUrl = process.env.BASE_URL;

  private _lang = 'fr';
 
  constructor() {
    this._store = Vue.observable({
      config: {}
    });

    //
    // i18n init, default is FR
    const lang = navigator.language || navigator['userLanguage'];   
    if (/^en\b/.test(lang)) {
      this._lang = "fr";
    }
    if (/^fr\b/.test(lang)) {
      this._lang = "fr";
    }
    if (/^de\b/.test(lang)) {
      this._lang = "de";
    }

  }

  get config() {
    return this._store.config;
  }

  get store() {
    return this._store;
  }

  get lang() {
    return this._lang;
  }

  i18n(key) {
    if(!this.config.i18n) {
      return '';
    }
    return this.config.i18n[this._lang][key];
  }  
  async get(force?: boolean){
    if(!this._store.config.done && !force) {
      const res = await axios.get(this._baseUrl + 'config.json',defaultAxios);
      this._store.config = res.data;
      console.log('--',this._store.config);
      this._store.config.done = true;

      // console.log('---DBG', JSON.stringify(this._store,null,2))
      //
      // generate root colors
      this.generateColors(this._store.config.themes);
    }

    return this._store.config;
  }  

  generateColors(themes){
    const root = document.documentElement;
    Object.keys(themes).forEach(theme => {
      const primary = themes[theme].primary
      root.style.setProperty('--theme-'+theme+'-primary',primary);

      const secondary = themes[theme].secondary
      root.style.setProperty('--theme-'+theme+'-secondary',secondary);

      const tertiary = themes[theme].tertiary
      root.style.setProperty('--theme-'+theme+'-tertiary',tertiary);
    });
  }


  async storageGet(key: string) {
    return new Promise((resolve, reject) => {
      try {
        const item = localStorage.getItem(key);
        const parsed = JSON.parse(item as string);
        resolve(parsed);
      } catch (err) {
        return reject(err);
      }
    });
  }

  async storageSet(key: string, value: any) {
    return new Promise((resolve, reject) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        resolve(value);
      } catch (err) {
        reject(err);
      }
    });
  }
}

//
// service start with $
export const $config = new ConfigService();