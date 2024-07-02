
import BannerSinFoto from "./cdgbannersinfoto";


export default function Banner() {
    const Banner = {
        titulo: "Bienvenido",
        parrafo: "Joyas sagradas con significados que apelan a conectar con ellas y así traer a la memoria a las diosas, la sagrada feminidad, la vida y el universo. Te invito a conocerlas y encontrar la que resuene contigo.",
        IconosData : [
            "/img/iconos/hechoamano.png",
            "/img/iconos/plata950.png",
            "/img/iconos/unico.png",
            "/img/iconos/emprendedora.png",
            "/img/iconos/slowfashion.png",
            "/img/iconos/conamor.png",
          ],
      };
    
      return (
        <BannerSinFoto BannerSinFotoData={Banner} />
      )
    }