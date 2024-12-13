import { wireframeJSONToSVG } from 'roadmap-renderer';
import { httpPost } from '../../lib/http';
import { isLoggedIn } from '../../lib/jwt';
import { renderResourceProgress, type ResourceType } from '../../lib/resource-progress';
import { cambiarSegunRol } from './variable';
import { crearGrafico } from './crearGrafico';


export const prerender = false

// TODO: FALTA HACER ESTO VARIABLE SEGUN LO ESCOGIDO POR EL USUARIO
const puesto = 'junior'
export class Renderer {
  resourceId: string;
  resourceType: string;
  loaderHTML: string | null;
  jsonData: any;
  containerId: string;
  loaderId: string;



  componentesCategoriaPrimerNivel: string[];
  componentesCategoriaSegundoNivel: [string, string][];
  componentesCategoriaTercerNivel: [string, string][];

  categoriasTeniendoRolDiferenciacion: string[];


  constructor() {
    this.resourceId = '';
    this.resourceType = '';
    this.loaderHTML = null;
    this.containerId = 'resource-svg-wrap';
    this.loaderId = 'resource-loader';


    this.init = this.init.bind(this);
    this.onDOMLoaded = this.onDOMLoaded.bind(this);
    this.jsonToSvg = this.jsonToSvg.bind(this);
    this.handleSvgClick = this.handleSvgClick.bind(this);
    this.prepareConfig = this.prepareConfig.bind(this);
    this.switchRoadmap = this.switchRoadmap.bind(this);

    this.componentesCategoriaPrimerNivel = [];
    this.componentesCategoriaSegundoNivel = [];
    this.componentesCategoriaTercerNivel = [];

    this.categoriasTeniendoRolDiferenciacion = [];


  }

  get loaderEl() {

    return document.getElementById(this.loaderId);
  }

  get containerEl() {
    return document.getElementById(this.containerId);
  }

  prepareConfig() {

    if (!this.containerEl) {
      return false;
    }
    this.loaderHTML = this.loaderEl!.innerHTML;
    const dataset = this.containerEl.dataset;
    this.resourceType = dataset.resourceType!;
    this.resourceId = dataset.resourceId!;



    const componentesCategoriaPrimerNivelString = dataset.componentesCategoriaPrimerNivel || '';
    this.componentesCategoriaPrimerNivel = componentesCategoriaPrimerNivelString.split(',').map(item => item.trim());

    const componentesCategoriaSegundoNivelString = dataset.componentesCategoriaSegundoNivel || '';
    const itemsArray = componentesCategoriaSegundoNivelString.split(',').map(item => item.trim());

    // Create tuples with current and next items, skipping every other item
    const componentesCategoriaSegundoNivelArray: [string, string][] = [];
    for (let i = 0; i < itemsArray.length; i += 2) {
      const currentItem = itemsArray[i];
      const nextItem = i + 1 < itemsArray.length ? itemsArray[i + 1] : ''; // If there's no next item, use an empty string
      componentesCategoriaSegundoNivelArray.push([currentItem, nextItem]);
    }
    this.componentesCategoriaSegundoNivel = componentesCategoriaSegundoNivelArray;

    const componentesCategoriaTercerNivelString = dataset.componentesCategoriaTercerNivel || '';
    const itemsArrayTercerNivel = componentesCategoriaTercerNivelString.split(',').map(item => item.trim());

    const componentesCategoriaTercerNivelArray: [string, string][] = [];
    for (let i = 0; i < itemsArrayTercerNivel.length; i += 2) {
      const currentItem = itemsArrayTercerNivel[i];
      const nextItem = i + 1 < itemsArrayTercerNivel.length ? itemsArrayTercerNivel[i + 1] : ''; // If there's no next item, use an empty string
      componentesCategoriaTercerNivelArray.push([currentItem, nextItem]);
    }
    this.componentesCategoriaTercerNivel = componentesCategoriaTercerNivelArray;
    // this.componentesCategoriaTercerNivel = componentesCategoriaTercerNivelString.split(',').map(item => item.trim());
    const formatoCorrectoCategoriasRol = dataset.listaCategoriaRol || ''
    this.categoriasTeniendoRolDiferenciacion = formatoCorrectoCategoriasRol.split(',').map(item => item.trim());


    const creacion = crearGrafico(this.componentesCategoriaPrimerNivel, this.componentesCategoriaSegundoNivel, this.componentesCategoriaTercerNivel)
    console.log(creacion)
    console.log(this.categoriasTeniendoRolDiferenciacion)
    console.log('estoy render')
    // this.jsonData = cambiarSegunRol(creacion, this.categoriasTeniendoRolDiferenciacion)
    this.jsonData = creacion;
    //this.jsonData=crearGrafico(this.componentesCategoriaPrimerNivel, this.componentesCategoriaSegundoNivel, this.componentesCategoriaTercerNivel)





    return true;
  }

  /**
   * @param { string } jsonData
   * @returns {Promise<SVGElement>}
   */
  jsonToSvg(jsonData: string) {

    if (!jsonData) {
      console.error('jsonData not defined in frontmatter');
      return null;
    }

    if (!this.containerEl) {
      return null;
    }

    this.containerEl.innerHTML = this.loaderHTML!;
    console.log(jsonData)

    return wireframeJSONToSVG(JSON.parse(JSON.stringify(jsonData)), {
      fontURL: '/fonts/balsamiq.woff2',

    })
      .then((svg: string | Node) => {
        this.containerEl?.replaceChildren(svg);
      })
      .then(() => {
        return renderResourceProgress(
          this.resourceType as ResourceType,
          this.resourceId
        );
      })
      .catch((error: { message: any; stack: any; }) => {
        if (!this.containerEl) {
          return;
        }

        const message = `
          <strong>There was an error.</strong><br>
          Try loading the page again. or submit an issue on GitHub with following:<br><br>
          ${error.message} <br /> ${error.stack}`;

        this.containerEl.innerHTML = `<div class="error py-5 text-center text-red-600 mx-auto">${message}</div>`;
      });
  }

  trackVisit() {
    if (!isLoggedIn()) {
      return;
    }

    window.setTimeout(() => {
      httpPost(`${import.meta.env.PUBLIC_API_URL}/v1-visit`, {
        resourceId: this.resourceId,
        resourceType: this.resourceType,
      }).then(() => null);
    }, 0);
  }

  onDOMLoaded() {

    if (!this.prepareConfig()) {
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const roadmapType = urlParams.get('r');

    this.trackVisit();

    if (roadmapType) {
      this.switchRoadmap(`/jsons/roadmaps/${roadmapType}.json`);
    } else {
      this.jsonToSvg(this.jsonData);
    }
  }

  switchRoadmap(newjsonData: string) {

    const newJsonFileSlug = newjsonData.split('/').pop()?.replace('.json', '');

    // Update the URL and attach the new roadmap type
    if (window?.history?.pushState) {
      const url = new URL(window.location.href);
      const type = this.resourceType[0]; // r for roadmap, b for best-practices

      url.searchParams.delete(type);
      url.searchParams.set(type, newJsonFileSlug!);

      window.history.pushState(null, '', url.toString());
    }

    const pageType = this.resourceType.replace(/\b\w/g, (l) => l.toUpperCase());

    window.fireEvent({
      // RoadmapClick, BestPracticesClick, etc
      category: `${pageType.replace('-', '')}Click`,
      // roadmap/frontend/switch-version
      action: `${this.resourceId}/switch-version`,
      // roadmap/frontend/switch-version
      label: `${newJsonFileSlug}`,
    });
    this.jsonToSvg(newjsonData)?.then(() => {
      this.containerEl?.setAttribute('style', '');
    });
  }

  handleSvgClick(e: any) {
    const targetGroup = e.target?.closest('g') || {};
    const groupId = targetGroup.dataset ? targetGroup.dataset.groupId : '';
    if (!groupId) {
      return;
    }

    e.stopImmediatePropagation();

    if (/^ext_link/.test(groupId)) {
      const externalLink = groupId.replace('ext_link:', '');

      if (!externalLink.startsWith('roadmap.sh')) {
        window.fireEvent({
          category: 'RoadmapExternalLink',
          action: `${this.resourceType} / ${this.resourceId}`,
          label: externalLink,
        });
      }

      window.open(`https://${externalLink}`);
      return;
    }

    if (/^json:/.test(groupId)) {
      // e.g. /roadmaps/frontend-beginner.json
      const newjsonData = groupId.replace('json:', '');
      this.switchRoadmap(newjsonData);
      return;
    }

    if (/^check:/.test(groupId)) {
      window.dispatchEvent(
        new CustomEvent(`${this.resourceType}.topic.toggle`, {
          detail: {
            topicId: groupId.replace('check:', ''),
            resourceType: this.resourceType,
            resourceId: this.resourceId,
          },
        })
      );
      return;
    }

    // Remove sorting prefix from groupId
    const normalizedGroupId = groupId.replace(/^\d+-/, '');

    window.dispatchEvent(
      new CustomEvent(`${this.resourceType}.topic.click`, {
        detail: {
          topicId: normalizedGroupId,
          resourceId: this.resourceId,
          resourceType: this.resourceType,
        },
      })
    );
  }








  init() {
    window.addEventListener('DOMContentLoaded', this.onDOMLoaded);
    window.addEventListener('click', this.handleSvgClick);
    // window.addEventListener('contextmenu', this.handleSvgClick);
  }


}


const renderer = new Renderer();
renderer.init();
