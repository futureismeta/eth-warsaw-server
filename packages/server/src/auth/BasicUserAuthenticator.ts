import crypto from "crypto";
import express from "express";
import { UserIdentity, CharacterDescription, UserData } from "@mml-io/3d-web-user-networking";

export type AuthUser = {
  clientId: number | null;
  userData?: UserData;
  sessionToken: string;
};

export type BasicUserAuthenticatorOptions = {
  devAllowUnrecognizedSessions: boolean;
};

const defaultOptions: BasicUserAuthenticatorOptions = {
  devAllowUnrecognizedSessions: false,
};

export class BasicUserAuthenticator {
  private userBySessionToken = new Map<string, AuthUser>();

  constructor(
      private characterDescription: CharacterDescription,
      private options: BasicUserAuthenticatorOptions = defaultOptions
  ) {}

  public async generateAuthorizedSessionToken(_req: express.Request): Promise<string | null> {
    const sessionToken = crypto.randomBytes(20).toString("hex");
    const authUser: AuthUser = {
      clientId: null,
      sessionToken,
    };

    console.log("Generated session token", sessionToken);

    this.userBySessionToken.set(sessionToken, authUser);
    return sessionToken;
  }

  public async onClientConnect(
      clientId: number,
      sessionToken: string,
      userIdentityPresentedOnConnection?: UserIdentity
  ): Promise<UserData | null> {
    console.log(`Client ID: ${clientId} joined with token ${sessionToken}`);
    let user = this.userBySessionToken.get(sessionToken);
    if (!user) {
      console.error(`Invalid initial user-update for clientId ${clientId}, unknown session`);

      if (this.options.devAllowUnrecognizedSessions) {
        console.warn(`Dev mode: allowing unrecognized session token`);
        user = {
          clientId: null,
          sessionToken,
        };
        this.userBySessionToken.set(sessionToken, user);
      }
      return null;
    }

    if (user.clientId !== null) {
      console.error(`Session token already connected`);
      return null;
    }

    user.clientId = clientId;
    user.userData = {
      username: `User ${clientId}`,
      characterDescription: this.characterDescription,
    };
    if (userIdentityPresentedOnConnection) {
      console.warn("Ignoring user-identity on initial connect");
    }
    return user.userData;
  }

  public getClientIdForSessionToken(sessionToken: string): { id: number } | null {
    const user = this.userBySessionToken.get(sessionToken);
    if (!user) {
      console.error("getClientIdForSessionToken - unknown session");
      return null;
    }
    if (user.clientId === null) {
      console.error("getClientIdForSessionToken - client not connected");
      return null;
    }
    return { id: user.clientId };
  }

  public onClientUserIdentityUpdate(clientId: number, _userIdentity: UserIdentity): UserData | null {
    // This implementation does not allow updating user data after initial connect.
    return null;
  }

  public onClientDisconnect(clientId: number): void {
    console.log(`Remove user-session for ${clientId}`);
    const userData = [...this.userBySessionToken.values()].find((user) => user.clientId === clientId);
    if (userData) {
      userData.clientId = null;
      this.userBySessionToken.delete(userData.sessionToken);
    }
  }
}