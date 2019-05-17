export interface INavigation {
    props: {navigation:any};
    _$regNvEvents:Object;

    /**已经获取到焦点*/
    didFocus:()=>void;

    /**将要获取到焦点*/
    willFocus:()=>void;

    /**已经失去焦点*/
    didBlur:()=>void;

    /**将要失去焦点*/
    willBlur:()=>void;
}