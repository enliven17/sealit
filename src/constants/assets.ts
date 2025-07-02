export const BLND = {
  code: 'BLND',
  issuer: 'GATALTGTWIOT6BUDBCZM3Q4OQ4BO2COLOAZ7IYSKPLC2PMSOPPGF5V56',
};
export const BLEND_POOL_ADDRESS = 'CCLBPEYS3XFK65MYYXSBMOGKUI4ODN5S7SUZBGD7NALUQF64QILLX5B5'; // Blend TestnetV2 Pool
export const PLATFORM_ADDRESS = 'GATALTGTWIOT6BUDBCZM3Q4OQ4BO2COLOAZ7IYSKPLC2PMSOPPGF5V56'; // Platform hesabı (BLND issuer'ı kullanıyoruz)
export const BLEND_POOL_CONTRACT_ID = 'CBLENDTESTNETCONTRACTADDRESS'; // TODO: Replace with actual testnet contract address from blend-utils
export const AQUA_CONTRACT_ID = 'CAQUATESTNETCONTRACTADDRESS'; // TODO: Replace with actual AQUA contract address
export const YUSDC_CONTRACT_ID = 'CYUSDCTESTNETCONTRACTADDRESS'; // TODO: Replace with actual yUSDC contract address
export const BLEND_DEPOSIT_FUNCTION = 'deposit'; // or 'join_pool', update as needed

// BLND/XLM oranı ve unlock hesaplama sabitleri
export const BLND_XLM_RATIO = 0.3; // 1 XLM = 0.3 BLND
export const SECURITY_FEE_PERCENTAGE = 0.2; // %20 güvenlik payı
export const BASE_UNLOCK_MULTIPLIER = BLND_XLM_RATIO * (1 + SECURITY_FEE_PERCENTAGE); // 0.36 BLND per XLM

// Unlock ücreti hesaplama fonksiyonu
export const calculateUnlockFee = (xlmAmount: number): number => {
  const baseFee = xlmAmount * BLND_XLM_RATIO;
  const securityFee = baseFee * SECURITY_FEE_PERCENTAGE;
  return Math.round((baseFee + securityFee) * 100) / 100; // 2 decimal places
}; 