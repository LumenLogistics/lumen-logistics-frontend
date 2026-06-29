import { callContractMethod, readContractState, toScVal } from "./client";

const SHIPMENT_CONTRACT_ID =
  import.meta.env.VITE_SHIPMENT_CONTRACT_ID ??
  import.meta.env.VITE_ESCROW_CONTRACT_ID ?? // legacy alias
  "";

export interface EscrowState {
  id: string;
  payer: string;
  payee: string;
  amount: number;
  token: string;
  status: "PENDING" | "ESCROWED" | "RELEASED" | "DISPUTED" | "FAILED";
  milestones: string[];
  confirmedMilestones: string[];
}

export interface ShipmentContractState {
  id: number;
  sender: string;
  receiver: string;
  carrier: string;
  status: string;
  escrow_amount: bigint;
  total_escrow: bigint;
  finalized: boolean;
  deadline: number;
}

function requireContract(): string {
  if (!SHIPMENT_CONTRACT_ID) {
    throw new Error(
      "VITE_SHIPMENT_CONTRACT_ID is not configured. " +
        "Add it to frontend/.env as VITE_SHIPMENT_CONTRACT_ID=<contract_id>",
    );
  }
  return SHIPMENT_CONTRACT_ID;
}

export const escrowContract = {
  /** @deprecated Use shipmentContract.depositEscrow instead */
  createEscrow: async (
    escrowId: string,
    payer: string,
    payee: string,
    amount: number,
  ): Promise<string> => {
    return callContractMethod(requireContract(), "initialize", [
      toScVal(escrowId),
      toScVal(payer),
      toScVal(payee),
      toScVal(amount),
    ]);
  },

  /** @deprecated Use shipmentContract.recordMilestone instead */
  confirmMilestone: async (
    escrowId: string,
    milestoneId: string,
  ): Promise<string> => {
    return callContractMethod(requireContract(), "confirm_milestone", [
      toScVal(escrowId),
      toScVal(milestoneId),
    ]);
  },

  /** @deprecated Use shipmentContract.releaseEscrow instead */
  releasePayment: async (escrowId: string): Promise<string> => {
    return callContractMethod(requireContract(), "release", [
      toScVal(escrowId),
    ]);
  },

  /** @deprecated Use shipmentContract.getShipment instead */
  getState: async (escrowId: string): Promise<EscrowState> => {
    return readContractState<EscrowState>(requireContract(), "get_state", [
      toScVal(escrowId),
    ]);
  },
};

/** Primary interface — maps to the OrbitHaul Shipment contract directly */
export const shipmentContract = {
  depositEscrow: async (shipmentId: bigint, amount: bigint): Promise<string> =>
    callContractMethod(requireContract(), "deposit_escrow", [
      toScVal(shipmentId),
      toScVal(amount),
    ]),

  releaseEscrow: async (shipmentId: bigint): Promise<string> =>
    callContractMethod(requireContract(), "release_escrow", [
      toScVal(shipmentId),
    ]),

  refundEscrow: async (shipmentId: bigint): Promise<string> =>
    callContractMethod(requireContract(), "refund_escrow", [
      toScVal(shipmentId),
    ]),

  getEscrowBalance: async (shipmentId: bigint): Promise<bigint> =>
    readContractState<bigint>(requireContract(), "get_escrow_balance", [
      toScVal(shipmentId),
    ]),

  releaseMilestonePayment: async (
    shipmentId: bigint,
    milestone: string,
  ): Promise<string> =>
    callContractMethod(requireContract(), "release_milestone_payment", [
      toScVal(shipmentId),
      toScVal(milestone),
    ]),

  getShipment: async (shipmentId: bigint): Promise<ShipmentContractState> =>
    readContractState<ShipmentContractState>(requireContract(), "get_shipment", [
      toScVal(shipmentId),
    ]),

  raiseDispute: async (
    shipmentId: bigint,
    reasonHash: Uint8Array,
  ): Promise<string> =>
    callContractMethod(requireContract(), "raise_dispute", [
      toScVal(shipmentId),
      toScVal(reasonHash),
    ]),

  recordMilestone: async (
    shipmentId: bigint,
    checkpoint: string,
    dataHash: Uint8Array,
  ): Promise<string> =>
    callContractMethod(requireContract(), "record_milestone", [
      toScVal(shipmentId),
      toScVal(checkpoint),
      toScVal(dataHash),
    ]),

  confirmDelivery: async (
    shipmentId: bigint,
    deliveryHash: Uint8Array,
  ): Promise<string> =>
    callContractMethod(requireContract(), "confirm_delivery", [
      toScVal(shipmentId),
      toScVal(deliveryHash),
    ]),

  verifyDataHash: async (
    shipmentId: bigint,
    hash: Uint8Array,
  ): Promise<boolean> =>
    readContractState<boolean>(requireContract(), "verify_data_hash", [
      toScVal(shipmentId),
      toScVal(hash),
    ]),
};
