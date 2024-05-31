import { Roboto, Inter } from "next/font/google";

const roboto = Roboto({
    weight: '400',
    subsets:['latin']
  });

  const inter = Inter({
    weight:'400',
    subsets:['latin']
  });


const RobotoLoader = ({ children })=> {
    return ( 
        <div className={roboto.className}>
            {children}
        </div>
     );
}

const InterLoader = ({ children })=> {
    return ( 
        <div className={inter.className}>
            {children}
        </div>
     );
}

export  { RobotoLoader, InterLoader };  