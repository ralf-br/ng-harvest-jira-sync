export module Utils {

//inspired by http://stackoverflow.com/a/9609450
  export function decodeHtmlEntities(str: string): string {
    if (str && typeof str === 'string') {
      let element = document.createElement('div');
      // strip script/html tags
      str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
      str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
      element.innerHTML = str;
      str = element.textContent;
      element.textContent = '';
    }

    return str;
  }

}
