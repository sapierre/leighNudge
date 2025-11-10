import * as Linking from "expo-linking";

import {
  getInvitationsResponseSchema,
  getMembersResponseSchema,
} from "@turbostarter/api/schema";
import { handle } from "@turbostarter/api/utils";

import { pathsConfig } from "~/config/paths";
import { api } from "~/lib/api";
import { authClient } from "~/lib/auth";

import type { InferRequestType } from "hono/client";

const KEY = "organizations";

const queries = {
  get: (params: { slug: string } | { id: string }) => ({
    queryKey: [KEY, params],
    queryFn: () =>
      authClient.organization.getFullOrganization({
        query:
          "id" in params
            ? { organizationId: params.id }
            : { organizationSlug: params.slug },
        fetchOptions: {
          throw: true,
        },
      }),
  }),
  members: {
    getIsOnlyOwner: ({ id }: { id: string }) => ({
      queryKey: [
        ...queries.get({ id }).queryKey,
        "members",
        "is-only-owner",
        id,
      ],
      queryFn: () =>
        handle(api.organizations[":id"].members["is-only-owner"].$get)({
          param: { id },
        }),
    }),
    getAll: ({
      id,
      ...query
    }: InferRequestType<
      (typeof api.organizations)[":id"]["members"]["$get"]
    >["query"] & { id: string }) => ({
      queryKey: [...queries.get({ id }).queryKey, "members", query],
      queryFn: () =>
        handle(api.organizations[":id"].members.$get, {
          schema: getMembersResponseSchema,
        })({
          query,
          param: {
            id,
          },
        }),
    }),
  },
  invitations: {
    get: ({ id }: { id: string }) => ({
      queryKey: [...queries.get({ id }).queryKey, "invitations"],
      queryFn: () =>
        authClient.organization.getInvitation({
          query: {
            id,
          },
          fetchOptions: {
            throw: true,
          },
        }),
    }),
    getAll: ({
      id,
      ...query
    }: InferRequestType<
      (typeof api.organizations)[":id"]["invitations"]["$get"]
    >["query"] & { id: string }) => ({
      queryKey: [...queries.get({ id }).queryKey, "invitations", query],
      queryFn: () =>
        handle(api.organizations[":id"].invitations.$get, {
          schema: getInvitationsResponseSchema,
        })({
          query,
          param: {
            id,
          },
        }),
    }),
  },
};

const mutations = {
  getSlug: {
    mutationKey: [KEY, "slug"],
    mutationFn: (data: InferRequestType<typeof api.organizations.slug.$get>) =>
      handle(api.organizations.slug.$get)(data),
  },
  setActive: {
    mutationKey: [KEY, "active"],
    mutationFn: (
      params: Parameters<typeof authClient.organization.setActive>[0],
    ) => authClient.organization.setActive(params),
  },
  delete: {
    mutationKey: [KEY, "delete"],
    mutationFn: (
      params: Parameters<typeof authClient.organization.delete>[0],
    ) => authClient.organization.delete(params),
  },
  leave: {
    mutationKey: [KEY, "members", "leave"],
    mutationFn: (params: Parameters<typeof authClient.organization.leave>[0]) =>
      authClient.organization.leave(params),
  },
  create: {
    mutationKey: [KEY, "create"],
    mutationFn: (
      params: Parameters<typeof authClient.organization.create>[0],
    ) =>
      authClient.organization.create({
        ...params,
        fetchOptions: { throw: true },
      }),
  },
  update: {
    mutationKey: [KEY, "update"],
    mutationFn: (
      params: Parameters<typeof authClient.organization.update>[0],
    ) => authClient.organization.update(params),
  },
  invitations: {
    accept: {
      mutationKey: [KEY, "invitations", "accept"],
      mutationFn: (
        params: Parameters<typeof authClient.organization.acceptInvitation>[0],
      ) => authClient.organization.acceptInvitation(params),
    },
    reject: {
      mutationKey: [KEY, "invitations", "reject"],
      mutationFn: (
        params: Parameters<typeof authClient.organization.rejectInvitation>[0],
      ) => authClient.organization.rejectInvitation(params),
    },
  },
  members: {
    invite: {
      mutationKey: [KEY, "members", "invite"],
      mutationFn: (
        params: Parameters<typeof authClient.organization.inviteMember>[0],
      ) =>
        authClient.organization.inviteMember(params, {
          headers: {
            "x-url": `${Linking.createURL(pathsConfig.setup.auth.join)}`,
          },
        }),
    },
  },
};

export const organization = {
  queries,
  mutations,
};
