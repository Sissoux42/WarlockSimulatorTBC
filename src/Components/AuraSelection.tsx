import { useDispatch, useSelector } from "react-redux";
import { Auras } from "../data/Auras";
import { RootState } from "../redux/Store";
import { Aura, AuraGroupKey } from "../Types";
import { AuraGroups } from "../data/AuraGroups";
import { setAurasStats, toggleAuraSelection } from "../redux/PlayerSlice";
import { nanoid } from "nanoid";
import { getAurasStats } from "../Common";

export default function AuraSelection() {
  const playerState = useSelector((state: RootState) => state.player);
  const dispatch = useDispatch();

  function auraClickHandler(aura: Aura) {
    dispatch(toggleAuraSelection(aura));
    dispatch(setAurasStats(getAurasStats(playerState.auras)));
  }

  return(
    <section id="buffs-and-debuffs-section">
      {
        AuraGroups.map(auraGroup =>
          <div
            key={nanoid()}
            style={{display: auraGroup.heading !== AuraGroupKey.PetBuffs || playerState.talents.demonicSacrifice === 0 || playerState.settings.sacrificePet === 'no' ? '' : 'none'}}>
            <h3 id='buffs-heading'>{auraGroup.heading}</h3>
            <ul>
              {
                Auras.filter((e) => e.group === auraGroup.heading).map((aura, j) =>
                  <li
                    key={j}
                    id={aura.varName}
                    className='buffs aura'
                    data-checked={playerState.auras[aura.varName] === true}
                    onClick={(e) => { auraClickHandler(aura); e.preventDefault() }}
                    style={{display: (!aura.forPet || (playerState.settings.petMode === '1' && (!playerState.talents.demonicSacrifice || playerState.settings.sacrificePet === 'no'))) ? '' : 'none'}}>
                    <a href={`https://tbc.wowhead.com/${auraGroup.type}=${aura.id}`}>
                      <img src={`${process.env.PUBLIC_URL}/img/${aura.iconName}.jpg`} alt={aura.name} />
                    </a>
                  </li>
                )
              }
            </ul>
          </div>
        )
      }
    </section>
  )
}