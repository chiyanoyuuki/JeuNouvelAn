import DATA from '../assets/data.json';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent implements OnInit
{
  joueurs:any = DATA.joueurs;
  actions:any = DATA.actions;
  lancer=true;
  joueur:any;
  tour:any={};

  ngOnInit()
  {
    this.newTour();
  }

  addJoueur()
  {
    this.joueurs.push({nom:"",boire:"0",sex:false,physique:false,femme:false});
  }

  newTour()
  {
    this.tour={actions:[]};
    if(!this.lancer)this.lancer=true;
    let nb = Math.floor(Math.random()*this.joueurs.length);
    this.joueur = this.joueurs[nb];
    
    let boire = {nom:'Boire',solo:true,global:"doit boire " + (this.joueur.boire>2?"deux":"une") + " gorgée" + (this.joueur.boire>2?"s":"")};
    let malus = this.actions.find((a:any)=>a.nom=="Malus");
    let chance = 2;
    let rdm = 0;
    while(rdm==0||this.tour.actions.length==this.actions.length)
    {
      let actionsleft = this.actions.filter((action:any)=>!this.tour.actions.includes(action));
      let taille = actionsleft.length;
      for(let i=0;i<3;i++)
      {
        for(let j=0;j<taille;j++)
        {
          actionsleft.push(actionsleft[j]);
        }
      }
      for(let i=0;i<Number(this.joueur.boire);i++)
      {
        actionsleft.push(boire);
      }
      console.log(actionsleft);
      nb = Math.floor(Math.random()*actionsleft.length);
      let action = actionsleft[nb];
      action.description = this.getDesc(action);
      this.tour.actions.push(action);
      rdm = Math.floor(Math.random()*chance);
      chance = chance + 1;
      if(action.nom==boire.nom){this.tour.actions=[boire];rdm=1;}
      if(action.nom=="Malus"){this.tour.actions=[malus];rdm=1;}
    }
  }

  getDesc(action:any): string
  {
    let description = '';

    let tmp = Math.floor(Math.random()*this.joueurs.length);

    for(let i=0;i<this.actions.length;i++)
    {
      description = action.global + " ";
      if(!action.solo) description = description + (this.joueurs[tmp]==this.joueur?action.global:this.joueurs[tmp].nom);
    }

    return description;
  }
}