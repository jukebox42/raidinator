import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { v4 as uuid } from "uuid";

import db from "../../store/db";
import { getMemberById, getProfile } from "../../bungie/api";

// Components
import { Loading } from "../generics";

// Interfaces
import * as Components from "../../bungie/interfaces/Destiny/Components";
import { PlayerData } from "../../utils/interfaces";

interface CardData {
  id?: string,
  key: string,
}

interface FireteamDialogProps {
  open: boolean;
  player: PlayerData | null;
  onLoadFireteam: (guardians: CardData[]) => void;
  onClose: () => void;
}

const FireteamDialog = ({ onLoadFireteam, onClose, player, open = false }: FireteamDialogProps) => {
  const [fetchingFireteam, setFetchingFireteam] = useState(false);

  const fetchFireteam = async () => {
    if (fetchingFireteam || !player) {
      return;
    }
    setFetchingFireteam(true);
    const result = await getProfile(player.membershipId, player.membershipType);
    setFetchingFireteam(false);
    console.log("RES", result);
    // TODO: Need an error message if there's no fireteam. Use snackbar?
    if(!result.profileTransitoryData?.data?.partyMembers) {
      console.log("No Party, not logged in");
      return onClose();
    }
    const party = result.profileTransitoryData.data.partyMembers;
    if (party.length <= 1) {
      console.log("No party, player is solo");
      return onClose();
    }
    console.log("Found a party");
    loadFireteam(party);
  };

  const loadFireteam = (party: Components.Profiles.DestinyProfileTransitoryPartyMember[]) => {
    // TODO: refactor this and maybe the player selector?
    //       Also we could check if the player is already cached and not reload them.
    const promises = party.map(async (member) => {
      const resp = await getMemberById(member.membershipId);
      const primaryMembership = resp.destinyMemberships.find(
        membership => membership.membershipId === resp.primaryMembershipId);
      if (primaryMembership) {
        const player = {
          bungieGlobalDisplayName: primaryMembership.bungieGlobalDisplayName,
          bungieGlobalDisplayNameCode: primaryMembership.bungieGlobalDisplayNameCode,
          membershipId: primaryMembership.membershipId,
          iconPath: primaryMembership.iconPath,
          membershipType: primaryMembership.membershipType
        };
        db.AppPlayers.put(player, primaryMembership.membershipId);
      }
      return {id: member.membershipId, key: uuid()}
    });
    Promise.all(promises).then(guardianMap => {
      onLoadFireteam(guardianMap);
      onClose();
    })

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
          This will clear out you other guardians and load their active party.
        </DialogContentText>
      </DialogContent>}
      {!fetchingFireteam && <DialogActions>
        <Button onClick={handleCloseWithCallback}>Yes</Button>
        <Button onClick={onClose} autoFocus>No</Button>
      </DialogActions>}
    </Dialog>
  );
};

export default FireteamDialog;