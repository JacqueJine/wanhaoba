const setRemUnit=()=>{
    const docEL=document.documentElement;
    const rem=docEL.clientWidth/3.75;
    docEL.style.fontSize=`${rem}px`;
};
const pageShowCallback=(e)=>{
    if(e.persisted){
        setRemUnit();
    }
}
document.addEventListener('DOMContentLoaded',setRemUnit,false);

window.addEventListener('resize',setRemUnit,false);
window.addEventListener('pageshow',pageShowCallback,false);
export default setRemUnit;