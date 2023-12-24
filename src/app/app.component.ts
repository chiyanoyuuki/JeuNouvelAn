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
  clickedAction:any;

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
    this.clickedAction = undefined;
    this.tour={actions:[]};
    if(!this.lancer)this.lancer=true;
    let nb = Math.floor(Math.random()*this.joueurs.length);
    this.joueur = this.joueurs[nb];
    
    let boire = {nom:'Boire',solo:true,global:"doit boire " + (this.joueur.boire>2?"deux":"une") + " gorgée" + (this.joueur.boire>2?"s":"")};
    let malus = {"nom":"Malus","global":"reçoit le malus","solo":true};
    let bonus = {"nom":"Bonue","global":"reçoit le bonus","solo":true};

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
      if(action.nom==boire.nom){this.tour.actions=[boire];rdm=100;}
      if(action.nom=="Malus"){this.tour.actions=[malus];rdm=100;}
      if(rdm>0&&this.tour.actions.length==1)this.clickedAction=action;
    }
  }

  getDesc(action:any): string
  {
    let description = '';

    let tmp = Math.floor(Math.random()*4);
    let rdm = Math.floor(Math.random()*this.joueurs.length);

    if(action.global)
    {
      description = action.global + " ";
      if(!action.solo) 
      {
        description = description + (this.joueurs[rdm]==this.joueur||tmp==0?action.choix:this.joueurs[rdm].nom);
      }
    }
    if(action.values)
    {
      let val = Math.floor(Math.random()*100);
      let found = false;
      for(let i=0;i<action.values.length&&!found;i++)
      {
        let value = action.values[i];
        if(this.joueur.sex&&value.cond=="sex"){}
        else if(this.joueur.physique&&value.cond=="physique"){}
        else if(this.joueur.lol&&value.cond=="lol"){}
        else if(value.chance>=val) 
        {
          description = description + " " + value.desc;
          found = true;
        }
      }
    }

    return description;
  }
}