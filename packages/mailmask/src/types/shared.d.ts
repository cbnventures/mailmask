/**
 * Shared - Route Decision.
 *
 * @since 0.0.1
 */
export type Shared_RouteDecision_Action = 'forward' | 'reject' | 'drop';

export type Shared_RouteDecision_Reason = string;

export type Shared_RouteDecision_DestinationEmail = string | undefined;

export type Shared_RouteDecision_AliasAddress = string | undefined;

export type Shared_RouteDecision_AliasLabel = string | undefined;

export type Shared_RouteDecision = {
  action: Shared_RouteDecision_Action;
  reason: Shared_RouteDecision_Reason;
  destinationEmail: Shared_RouteDecision_DestinationEmail;
  aliasAddress: Shared_RouteDecision_AliasAddress;
  aliasLabel: Shared_RouteDecision_AliasLabel;
};
