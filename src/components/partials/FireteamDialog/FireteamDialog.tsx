// TODO: refactor this so it has a utils file
import { useState, useContext } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import db from "../../../store/db";
import { getMemberById } from "../../../bungie/api";
import { AppContext } from "../../../context/AppContext";

// Components
import { Loading } from "../../generics";

// Interfaces
import * as Components from "../../../bungie/interfaces/Destiny/Components";
import { PlayerData } from "../../../utils/interfaces";
import { getCharacters } from "../../../store/api";

type Props = {
  open: boolean;
  player: PlayerData | null;
  onClose: () => void;
}

const FireteamDialog = ({ onClose, player, open = false }: Props) => {
  const context = useContext(AppContext);
  const [fetchingFireteam, setFetchingFireteam] = useState(false);

  const fetchFireteam = async () => {
    if (fetchingFireteam || !player) {
      return;
    }
    setFetchingFireteam(true);
    const {
      data,
      characterId,
      error,
      profileTransitoryData
    } = await getCharacters(player.membershipId, player.membershipType, true);
    if (error.errorCode !== 1) {
      context.addToast(`Failed to load fireteam: ${error.message}`, "error");
      return onClose();
    }
    setFetchingFireteam(false);
    if(!profileTransitoryData?.data?.partyMembers) {
      context.addToast(`Failed to load fireteam: ${player.bungieGlobalDisplayName} is offline.`, "info");
      return onClose();
    }
    const party = profileTransitoryData?.data?.partyMembers;
    if (party && party.length <= 1) {
      context.addToast(`Failed to load fireteam: ${player.bungieGlobalDisplayName} is solo.`, "info");
      return onClose();
    }
    await loadFireteam(party);
    return onClose();
  };

  const loadFireteam = async (party: Components.Profiles.DestinyProfileTransitoryPartyMember[]) => {
    // TODO: refactor this and maybe the player selector?
    //       Also we could check if the player is already cached and not reload them.
    const promises = party.map(async (member) => {
      const resp = await getMemberById(member.membershipId);
      let primaryMembership = resp.destinyMemberships.find(m => m.membershipId === resp.primaryMembershipId);
      if (!primaryMembership) {
        primaryMembership = resp.destinyMemberships[0]; // somehow it's possible to not have a primary membership?
      }
      const player = {
        bungieGlobalDisplayName: primaryMembership.bungieGlobalDisplayName,
        bungieGlobalDisplayNameCode: primaryMembership.bungieGlobalDisplayNameCode,
        membershipId: primaryMembership.membershipId,
        iconPath: primaryMembership.iconPath,
        membershipType: primaryMembership.membershipType
      };
      await db.AppPlayers.put(player, primaryMembership.membershipId);
      return { membershipId: player.membershipId, player };
    });
    const characterMap = await Promise.all(promises)
    await db.AppPlayersSelectedCharacter.clear();
    context.replaceCards(characterMap);
  }

  const handleCloseWithCallback = () => {
    fetchFireteam();
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Load Active Fireteam For {player ? player.bungieGlobalDisplayName : ""}#
        {player ? player.bungieGlobalDisplayNameCode : ""}?
      </DialogTitle>
      {fetchingFireteam && <DialogContent>
        <Loading marginTop="0px" />
      </DialogContent>}
      {!fetchingFireteam && <DialogContent>
        <DialogContentText id="alert-dialog-description">
          This will clear out your other guardians and load their active party.
        </DialogContentText>
      </DialogContent>}
      {!fetchingFireteam && <DialogActions>
        <Button onClick={handleCloseWithCallback} color="secondary">Yes</Button>
        <Button onClick={onClose} color="secondary" autoFocus>No</Button>
      </DialogActions>}
    </Dialog>
  );
};

export default FireteamDialog;