// Habillage : images de fond importées (Vite les bundle avec une URL hashée).
import lethee from '../../img/lethee.png'
import neutral from '../../img/neutral.png'
import victory from '../../img/victory.png'
import loss from '../../img/loss.png'
import arcade from '../../img/arcade.png'
import codename from '../../img/codename.png'
import crypto from '../../img/crypto.png'
import bowling from '../../img/bowling.png'
import tour from '../../img/tour.png'

export const IMAGES = { lethee, neutral, victory, loss, arcade, codename, crypto, bowling, tour }

// Fond du plateau selon la tension (moyenne des menaces, 0→1).
export function fondPlateau(tension) {
  return tension > 0.5 ? IMAGES.neutral : IMAGES.lethee
}
