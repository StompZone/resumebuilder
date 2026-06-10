import {
  siBehance,
  siBluesky,
  siDevdotto,
  siDribbble,
  siFacebook,
  siGithub,
  siGitlab,
  siInstagram,
  siMastodon,
  siMedium,
  siStackoverflow,
  siThreads,
  siTiktok,
  siTwitch,
  siX,
  siYoutube,
} from 'simple-icons';
import type { Profile } from './types';

export interface BrandIcon {
  title: string;
  path: string;
  viewBox?: string;
}

export interface SocialProfilePresentation {
  key: string;
  label: string;
  handle: string;
  href?: string;
  icon?: BrandIcon;
}

const linkedInIcon: BrandIcon = {
  title: 'LinkedIn',
  viewBox: '0 0 72 72',
  path: 'M62,62 L51.315625,62 L51.315625,43.8021149 C51.315625,38.8127542 49.4197917,36.0245323 45.4707031,36.0245323 C41.1746094,36.0245323 38.9300781,38.9261103 38.9300781,43.8021149 L38.9300781,62 L28.6333333,62 L28.6333333,27.3333333 L38.9300781,27.3333333 L38.9300781,32.0029283 C38.9300781,32.0029283 42.0260417,26.2742151 49.3825521,26.2742151 C56.7356771,26.2742151 62,30.7644705 62,40.051212 L62,62 Z M16.349349,22.7940133 C12.8420573,22.7940133 10,19.9296567 10,16.3970067 C10,12.8643566 12.8420573,10 16.349349,10 C19.8566406,10 22.6970052,12.8643566 22.6970052,16.3970067 C22.6970052,19.9296567 19.8566406,22.7940133 16.349349,22.7940133 Z M11.0325521,62 L21.769401,62 L21.769401,27.3333333 L11.0325521,27.3333333 L11.0325521,62 Z',
};

const iconsByKey: Array<[string, BrandIcon]> = [
  ['github', siGithub],
  ['gitlab', siGitlab],
  ['linkedin', linkedInIcon],
  ['x', siX],
  ['twitter', siX],
  ['instagram', siInstagram],
  ['youtube', siYoutube],
  ['facebook', siFacebook],
  ['tiktok', siTiktok],
  ['threads', siThreads],
  ['bluesky', siBluesky],
  ['mastodon', siMastodon],
  ['stackoverflow', siStackoverflow],
  ['dribbble', siDribbble],
  ['behance', siBehance],
  ['medium', siMedium],
  ['devto', siDevdotto],
  ['twitch', siTwitch],
];

function formatUrl(url: string): string {
  return url.replace(/https?:\/\/(www\.)?/, '');
}

function getNetworkKey(profile: Profile): string {
  const source = profile.network || profile.url || '';
  return source.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function getProfileHandle(profile: Profile): string {
  if (profile.username) return profile.username.replace(/^@/, '');

  if (profile.url) {
    try {
      const segments = new URL(profile.url).pathname.split('/').filter(Boolean);
      return segments.findLast((segment) => !['in', 'company', 'user', 'channel', 'c'].includes(segment.toLowerCase())) || formatUrl(profile.url);
    } catch {
      return formatUrl(profile.url);
    }
  }

  return profile.network;
}

export function getSocialIcon(profile: Profile): BrandIcon | undefined {
  const key = getNetworkKey(profile);
  return iconsByKey.find(([candidate]) => key.includes(candidate))?.[1];
}

export function getSocialProfilePresentation(profile: Profile): SocialProfilePresentation | null {
  const handle = getProfileHandle(profile);
  if (!handle) return null;

  const icon = getSocialIcon(profile);
  const network = profile.network || icon?.title || '';

  return {
    key: `${network}-${handle}-${profile.url || ''}`,
    label: network ? `${network}: ${handle}` : handle,
    handle,
    href: profile.url || undefined,
    icon,
  };
}

export function getSocialProfilePresentations(profiles: Profile[]): SocialProfilePresentation[] {
  return profiles
    .map(getSocialProfilePresentation)
    .filter((profile): profile is SocialProfilePresentation => Boolean(profile));
}
