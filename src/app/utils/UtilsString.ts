declare let jQuery:any;

export module UtilsString {

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

  /**
   * Replaces placeholders as %PLACEHOLDER% in the string with replacements
   * from a map as {"%PLACEHOLDER%": "text to insert",...}
   *
   * @param source
   * @param replacements
   * @returns {string}
   */
  export function formatString(source : string, replacements : any) : string{
    jQuery.each(replacements,function (i, n) {
      source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
    });
    return source;
  }
}
