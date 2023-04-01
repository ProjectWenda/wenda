export interface User {
  authUID: string;
}

export interface DiscordUser {
  accentColor: number;
  avatar: string;
  avatarDecoration: string;
  banner: string;
  bannerColor: string;
  discriminator: string;
  displayName: string;
  flags: number;
  globalName: string;
  id: string;
  locale: string;
  mfaEnabled: boolean;
  premiumType: number;
  publicFlags: number;
  username: string;
}

export const userFromServer = (user: ServerDiscordUser): DiscordUser => {
  return {
    accentColor: user.accent_color,
    avatar: user.avatar,
    avatarDecoration: user.avatar_decoration,
    banner: user.banner,
    bannerColor: user.banner_color,
    discriminator: user.discriminator,
    displayName: user.display_name,
    flags: user.flags,
    globalName: user.global_name,
    id: user.id,
    locale: user.locale,
    mfaEnabled: user.mfa_enabled,
    premiumType: user.premium_type,
    publicFlags: user.public_flags,
    username: user.username,
  };
}

export interface ServerDiscordUser {
  accent_color: number;
  avatar: string;
  avatar_decoration: string;
  banner: string;
  banner_color: string;
  discriminator: string;
  display_name: string;
  flags: number;
  global_name: string;
  id: string;
  locale: string;
  mfa_enabled: boolean;
  premium_type: number;
  public_flags: number;
  username: string;
}
