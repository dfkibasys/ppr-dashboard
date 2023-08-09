import VueI18n from 'vue-i18n';

export default interface BreadcrumbItem {
  text: VueI18n.TranslateResult;
  to: string;
  active: boolean;
}
