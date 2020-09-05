const ex = require('express');

const apps = ex(); 

const mul=require('multer');

const bP = require('body-parser');

const mongos = require('mongoose');

const Korisnik = require('./baza/Korisnik');

const nM = require("nodemailer");

const putanja = require("path");

const Knjiga = require('./baza/Knjiga');

const Procitana = require('./baza/Procitano');

const Citanje =require('./baza/Citanje');

const Komentar = require('./baza/Komentar')

const Desavanja = require('./baza/Desavanja')

mongos.set('useFindAndModify', false);


process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';

mongos.connect("mongodb+srv://peraff:jQJ4WJE9NlQh6S4d@cluster0.9yfr5.mongodb.net/projekatAvgust2020?retryWrites=true&w=majority").then(() => {});

let zahteviZaReg:any[] = [];
let mejlZaMenjanjeLozinke="";


var st = mul.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './back/slike');
    },
    filename: function (req, file, callback) {
      callback(null, "" + file.originalname);
    }
  });

var up = mul({ storage: st }); //dohvata sliku iz req! Prosledjujem kao midlvere

apps.use( (req, res, next) => { 
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Origin, Accept, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PATCH, DELETE, OPTIONS");
    next();
});

apps.use("/slike", ex.static(putanja.join('./back/slike')));
apps.use(bP.json());

const transporter = nM.createTransport({
  service: 'gmail',
  secure: false,
  auth: {
    user: 'ljubiteljiknjiga.podrska@gmail.com',
    pass: 'Gmail357'
  }
});

//drugi deo - registrovani korisnik 

//DOHVATA SVA DESAVANJA

apps.get('/dohvatiDesavanja',(req,res)=>{
  Desavanja.find().then(arg=>{
    res.json({
      arg:JSON.stringify(arg)
    });
  });
})

//PRIKAZ PROFILA KORISNIKA DRUGOM KORISNIKU

apps.post('/podaciOKorisniku', (req,res)=>{
  Korisnik.findOne({korIme: req.body.korIme}).then(arg=>{
    arg.slika="http://localhost:3000" + arg.slika.substring(4);
    res.json({
      arg: JSON.stringify(arg)
    });
  });
})


//OBRADA KOMENTARA - dodavanje u bazu, izvlacenje iz baze..

apps.post('/dohvatiKomentareZaKorisnika', (req,res)=>{
  Komentar.find({korisnik: req.body.korisnik}).then(arg=>{
    res.json({
      arg:JSON.stringify(arg)
    });
  });
});

apps.post('/dohvatiKomentareZaKnjigu', (req, res)=>{
  Komentar.find({nazivK: req.body.naziv}).then(arg=>{
    res.json({
      arg:JSON.stringify(arg)
    });
  });

});

apps.post('/azurirajKomentar', (req,res)=>{
  Komentar.findOneAndUpdate({nazivK: req.body.naziv, korisnik: req.body.korisnik},{komentar: req.body.komentar, ocena: req.body.ocena}).then(arg=>{
   console.log(arg);
   res.json({
   mess: "Usepesno ste azurirali vas komentar!"
   });
  })
})

apps.post('/unesiKomentar', (req,res)=>{
  const kom = new Komentar({
    nazivK: req.body.naziv,
    korisnik: req.body.korisnik, 
    komentar: req.body.komentar,
    ocena: req.body.ocena,
    autoriK: req.body.autori
  });

  kom.save();

  res.json({
    mess: 'Uspesno ste dodali komentar!'
  })
})

//OBRADA PODATAKA VEZANIH ZA KNJIGU 

apps.post('/azuriranPB', (req, res) =>{
  Citanje.findOneAndUpdate({nazivK: req.body.naziv, korisnik: req.body.korisnik}, {procitao: req.body.procitao, ukupno: req.body.ukupno}).then(arg=> {});
res.send();
})

apps.post('/podaciOCitanju', (req,res)=>{ // salje komponenti podatke dokle je korisnik stigao sa citanje i azurira PB
  Citanje.find({korisnik: req.body.korisnik, nazivK: req.body.naziv}).then(arg=>{
    if(arg[0]){
    let moje=arg[0];
    res.json({
      procitao: moje.procitao,
      ukupno: moje.ukupno
    });
  } else res.send();
  });
  });


apps.post('/trenutnoCita', (req, res)=>{  //kad se korisnik uloguje dohvatam sve knjige koje trenutno cita!
  Citanje.find({korisnik: req.body.korisnik}).then(arg=>{
    res.json({
      arg:JSON.stringify(arg)
    });
  });
  });


apps.post('/zapocniCitanje', (req, res)=>{ //kliknuto dugme - dodajem u Bazu samo bez brojeva str, to se naknadno unosi

  Citanje.findOne({nazivK: req.body.naziv, korisnik: req.body.korisnik}).then(arg => {
    if(arg){ 
      res.json({
        mess:"Greska! Trenutno citate ovu knjigu!"
      });
    } else{
      const cit = new Citanje({
        nazivK: req.body.naziv,
        korisnik: req.body.korisnik,
        procitao: 0,
        ukupno: 100
      });
    
      cit.save();
    
      res.json({
        mess: "Uspesno ste zapoceli sa citanjem! Ponovo se ulogujte da biste videli napredak!"
      });
    }
  });

});


apps.post('/procitane', (req, res)=>{  //kad se korisnik uloguje dohvatam sve njegove procitane knjige!
Procitana.find({korisnik: req.body.korisnik}).then(arg=>{
  if(arg){
  res.json({
    arg:JSON.stringify(arg)
  });
  }
});
});

apps.post('/procitana', (req, res)=>{         // kad se klikne na dugme da je knjiga procitana na stranici knjige - dodajem je u bazu
  Procitana.findOne({nazivK : req.body.naziv, korisnik: req.body.korisnik}).then( arg => { 
    if(arg) {
      res.json({
        mess: "Greska! Vec ste oznacili ovu knjigu kao procitanu!"
      });
    } else {
      Citanje.deleteOne({nazivK:req.body.naziv, korisnik: req.body.korisnik}).then(arg=>{});
      const pr = new Procitana({
        nazivK: req.body.naziv,
        korisnik: req.body.korisnik,
        zanroviK: req.body.zanrovi
      });

      pr.save();

      res.json({
        mess: "Nadamo se da ste uzivali u citanju ove knjige!!"
      });
      }
  });
})


//moderator prihvata ili odbija zahtev za novu knjigu pa unosim u bazu

apps.post('/prihvatiKnjigu', (req,res)=>{
Knjiga.findOneAndUpdate({nazivK: req.body.nazivK}, {odobrena: true}).then(arg=> {});
res.send();
});


apps.post('/odbijKnjigu', (req,res)=>{
  Knjiga.deleteOne({nazivK: req.body.nazivK}).then(arg=> {});
  res.send();
  });

//dohvati sve knjige iz baze - i odobrene i neodobrene pa samo prikazi moderatoru ove

apps.get('/sveKnjige', (req, res)=>{
  Knjiga.find().then(arg=>{
    res.json({
      arg:JSON.stringify(arg)
    });
  })

});

//dodavanje nove knjige

apps.post('/dodajKnjigu', up.single("slikaKnjige"), (req, res) => { 

 console.log(req.file);  //vraca undefined ako ne posaljem sliku

let slica: string="";
if(!req.file){
    slica='back\\slike\\DefaultKnjiga.jpg'
} else {
 
    slica = req.file.path;
}

const knj=new Knjiga({
  ...req.body,
  slikaK:slica,
  odobrena: false
});

knj.save();
 res.send();
});


apps.post('/izmeniPodatke', up.single("slika"), (req, res)=>{
  if(!req.file){ //ako slika nije menjana

    Korisnik.findOneAndUpdate({ korIme: req.body.korIme},
      {ime: req.body.ime, 
       prezime: req.body.prezime,
       drzava: req.body.drzava,
       grad: req.body.grad, 
       datum: req.body.datum,
       mejl: req.body.mejl
   }).then(arg => { 
  })
  } else {  //promenjena i slika - imamo req.file
    Korisnik.findOneAndUpdate( {korIme: req.body.korIme},
      {ime: req.body.ime, 
       prezime: req.body.prezime,
       drzava: req.body.drzava,
       grad: req.body.grad, 
       datum: req.body.datum,
       mejl: req.body.mejl,
       slika: req.file.path
   }).then(arg => {
   })
  }
  
  res.send();
});


// prvi deo - login registracija i promena lozinke!

apps.post('/promeniLozinku', (req, res) => { 

  Korisnik.findOneAndUpdate({ korIme: req.body.korIme, lozinka: req.body.lozinka }, {lozinka: req.body.nova }).then(arg=>{
    if(arg){
      res.json({
        fleg: true
      });
    } else{
      res.json({
        fleg: false
      });
    }
    
  });

});


apps.post('/sacuvajNovuLozinku', (req, res) =>{ 
  let korIme="";

  Korisnik.findOneAndUpdate({ mejl: mejlZaMenjanjeLozinke }, { lozinka: req.body.lozinka }).then(arg=>{
    korIme=arg.korIme;
    res.json({
      korIme: korIme
    });
  });


});

apps.post('/resetujLozinku', (req, res)=>{

//ubaci proveru unete e-mail adrese da li postoji u bazi
Korisnik.find({mejl:req.body.mejl}).then( arg=>{
 if(arg.length==0){ 
  res.json({
    mess:"Greska! Ne postoji e-mail u sistemu!"
  })
 } else{
  const mejl=req.body.mejl;
  mejlZaMenjanjeLozinke=mejl;
 
  var opcije = {
    from: 'ljubiteljiknjiga.podrska@gmail.com',
    to: mejl,
    subject: 'Resetovanje lozinka',
    html: '<h1>Resetovanje lozinke</h1><p>Pratite sledeci link da biste resetovali vasu lozinku!</p><a href="http://localhost:4200/novaLozinka">Kliknite ovde!</a>'
  };

  transporter.sendMail(opcije, () => {
    res.json({mess: 'Na mejl Vam je poslat link za resetovanje lozinke!'});
  });
 }
});

});

apps.post('/login', (req, res)=>{
  Korisnik.find({korIme: req.body.korIme, lozinka:req.body.lozinka}).then(kor => {
    let fleg= false;
    let tip=""; 
    let mojKor=kor[0];


    if(kor.length==1){
      fleg=true;
      tip=kor[0].tip;
      mojKor.slika= "http://localhost:3000" + mojKor.slika.substring(4);
    }
  
    res.json({
      fleg: fleg,
      korisnik: mojKor
    });
  })
  
})

apps.get('/zahtevi', (req, res) =>{
  res.json({
    zaht: zahteviZaReg
  });
});

apps.post('/obrisiKorisnika', (req, res)=>{
  zahteviZaReg.forEach((e, index) => {
    if(e.korIme==req.body.korIme) zahteviZaReg.splice(index,1);
  });
  res.json({
    mess:"sve je ok!"
  })
} );


apps.post('/dodajKorisnika', (req, res, next)=>{
const kor=new Korisnik({
    ...req.body,
    slika: req.body.slika
});
kor.save();
zahteviZaReg.forEach((e, index) => {
  if(e.korIme==req.body.korIme) zahteviZaReg.splice(index,1);
});
res.json({
  por: "sve ok!"
});
});

apps.post('/registracija', up.single("slika"), (req, res, next) => { 
    //sacuvaj u bazi sve zahteve i onda ih vrati administratoru! 
   //zahteviZaReg.push(req.body);
   // console.log(zahteviZaReg);
  /* console.log(req.body);
   console.log(req.file);  //vraca undefined ako ne posaljem sliku*/

   let zahtevReg: any;


  if(!req.file){
    zahtevReg = { 
      ...req.body, 
      slika: 'back\\slike\\Defaultpicture.jpg'
    }
  } else {
    zahtevReg = { 
      ...req.body, 
      slika: req.file.path
    }
  }
  
  console.log(zahtevReg);

  zahteviZaReg.push(zahtevReg);

   res.json({
       mess: "Sve ok"
   });
});


//gost - implementirana pretraga knjiga i dohvatanje podataka o pojedinacnoj knjizi!

apps.post('/nadjiKnjigu', (req,res)=>{
Knjiga.find({nazivK: new RegExp(req.body.naziv, 'i'), autoriK: new RegExp(req.body.autori, 'i')}).then(arg =>{

  if(!req.body.autori && req.body.zanr == '[]' && !req.body.naziv) {
    res.json({
      arg: undefined
    });
    return;
  }

if(!req.body.autori && req.body.zanr == '[]') {
  res.json({
    arg: JSON.stringify(arg)
  });
  return;
}

if(req.body.zanr=='[]'){
  res.json({
    arg: JSON.stringify(arg)
  });
  return;
}

let fleg: boolean=false;
let trazeniZanrovi = JSON.parse(req.body.zanr);
let nizPogodaka: any [] = [];

arg.forEach(e => {
  let nizZanrova = JSON.parse(e.zanroviK);
    let i=0;
    for(i=0; i<nizZanrova.length; i++){
      let j=0
        for(j=0; j<trazeniZanrovi.length; j++){
        if(nizZanrova[i] == trazeniZanrovi[j]) {
          fleg=true;
          nizPogodaka.push(e);
          break;
        }
      }
      if(fleg==true){
        fleg=false;
        break;
    }
  }
    });
    res.json({
      arg: JSON.stringify(nizPogodaka)
    });
  });
});

apps.post('/podaciKnjige', (req, res)=>{
  Knjiga.findOne({nazivK: req.body.naziv}).then(arg=>{
    arg.slikaK = "http://localhost:3000" + arg.slikaK.substring(4);
    res.json({
      arg: arg
    });
  })
})


//***********************************ADMIN MRTVI ************************************** */
apps.get('/sviKorisnici', (req, res)=>{
  Korisnik.find().then(arg=>{
    res.json({
      arg: arg
    });
  });
})

apps.post('/unapredi', (req,res)=>{
  Korisnik.findOneAndUpdate({korIme:req.body.korIme}, {tip: "moderator"}).then(arg=>{
    res.send();
  });
})

apps.post('/unazadi', (req,res)=>{
  Korisnik.findOneAndUpdate({korIme:req.body.korIme}, {tip: "registrovani"}).then(arg=>{
    res.send();
  });
})

apps.post('/ukloniZanr', (req, res)=>{
  let mojF:boolean = false;
  let mess: string="Uspesno ste obrisali ovaj zanr!";
  Knjiga.find().then(arg=>{
    arg.forEach(e => {
      let nizZanrova = JSON.parse(e.zanroviK);
      nizZanrova.forEach(zan => {
        if(zan==req.body.zanr) {
          mojF=true;
        }
      });
    });
    if(mojF==false){
      res.json({
        fleg: true,
        mess: mess
      });
    } else {
      mess="Ne moze se obrisati zanr za koji postoje knjige u sistemu!";
        res.json({
          fleg: false,
          mess: mess
        });
    }
    
  });
})

apps.post('/azurirajPodatkeKnjige', (req,res)=>{
  let mojString: string=req.body.zanrovi;
  let lepString: string="[";
  mojString.split(',').forEach(element => {
    lepString+= "\"" + element + "\"" + ","
  });
  lepString=lepString.slice(0, lepString.length-1);
  lepString=lepString + "]";
  Knjiga.findOneAndUpdate({nazivK: req.body.stariNaziv}, 
   {autoriK:req.body.knjiga.autoriK,
    datumK: req.body.knjiga.datumK,
    zanroviK: lepString,
    opisK : req.body.knjiga.opisK}).then(arg=>{
      let mess: String="Neuspeh!"
      if(arg) mess="Uspeh!"
      res.json({
        mess: mess
      })
    });

    
})

module.exports = apps; //izvozi i sve midlvere zakacene na nj. 