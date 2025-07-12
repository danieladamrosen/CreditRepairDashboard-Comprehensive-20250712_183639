import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronDown, ChevronUp, AlertTriangle, ThumbsUp, ArrowDown, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface InquiriesProps {
  creditData: any;
  onDisputeSaved?: (disputeData?: {
    reason: string;
    instruction: string;
    selectedItems: { [key: string]: boolean };
    isRecentInquiries?: boolean;
  }) => void;
  onHeaderReset?: (inquiryType?: 'older' | 'recent') => void;
  initialDisputeData?: {
    reason: string;
    instruction: string;
    selectedItems: { [key: string]: boolean };
  } | null;
  forceExpanded?: boolean;
  showOlderOnly?: boolean;
  hideOlderInquiries?: boolean;
}

export function Inquiries({
  creditData,
  onDisputeSaved,
  onHeaderReset,
  initialDisputeData,
  forceExpanded,
  showOlderOnly,
  hideOlderInquiries,
}: InquiriesProps): JSX.Element {
  const [showOlderInquiries, setShowOlderInquiries] = useState(false);
  const [showRecentInquiries, setShowRecentInquiries] = useState(false);
  const [selectedOlderInquiries, setSelectedOlderInquiries] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [selectedRecentInquiries, setSelectedRecentInquiries] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedReason, setSelectedReason] = useState('');
  const [selectedInstruction, setSelectedInstruction] = useState('');
  const [selectedRecentReason, setSelectedRecentReason] = useState('');
  const [selectedRecentInstruction, setSelectedRecentInstruction] = useState('');
  const [isOlderDisputeSaved, setIsOlderDisputeSaved] = useState(false);
  const [isRecentDisputeSaved, setIsRecentDisputeSaved] = useState(false);
  const [savedOlderDispute, setSavedOlderDispute] = useState<any>(null);
  const [savedRecentDispute, setSavedRecentDispute] = useState<any>(null);
  const [showOlderGuideArrow, setShowOlderGuideArrow] = useState(false);
  const [showGuideArrow, setShowGuideArrow] = useState(false);
  const [showCombinedCollapsedBox, setShowCombinedCollapsedBox] = useState(false);
  const [hasEverShownCombinedBox, setHasEverShownCombinedBox] = useState(false);
  const [isTypingReason, setIsTypingReason] = useState(false);
  const [isTypingInstruction, setIsTypingInstruction] = useState(false);
  const [isRecentTypingReason, setIsRecentTypingReason] = useState(false);
  const [isRecentTypingInstruction, setIsRecentTypingInstruction] = useState(false);
  const [showOlderInquiryWarning, setShowOlderInquiryWarning] = useState(false);
  const [showRecentInquiryWarning, setShowRecentInquiryWarning] = useState(false);
  const [pendingInquirySelection, setPendingInquirySelection] = useState<string | null>(null);
  const [pendingRecentInquirySelection, setPendingRecentInquirySelection] = useState<string | null>(
    null
  );
  const [pendingBulkSelection, setPendingBulkSelection] = useState<{
    [key: string]: boolean;
  } | null>(null);
  const [warningInquiryName, setWarningInquiryName] = useState<string>('');

  // Initialize state with saved dispute data and maintain persistence
  useEffect(() => {
    if (initialDisputeData?.isRecentInquiries && !isRecentDisputeSaved) {
      setSelectedRecentInquiries(initialDisputeData.selectedItems || {});
      setSelectedRecentReason(initialDisputeData.reason || '');
      setSelectedRecentInstruction(initialDisputeData.instruction || '');
      setIsRecentDisputeSaved(true);
      setSavedRecentDispute(initialDisputeData);
    } else if (
      initialDisputeData &&
      !initialDisputeData.isRecentInquiries &&
      !isOlderDisputeSaved
    ) {
      setSelectedOlderInquiries(initialDisputeData.selectedItems || {});
      setSelectedReason(initialDisputeData.reason || '');
      setSelectedInstruction(initialDisputeData.instruction || '');
      setIsOlderDisputeSaved(true);
      setSavedOlderDispute(initialDisputeData);
    }
  }, [initialDisputeData]);

  // Maintain saved state when sections are reopened - CRITICAL: Ensure saved disputes persist
  useEffect(() => {
    if (savedOlderDispute && !isOlderDisputeSaved) {
      console.log('🔄 RESTORING Older Inquiries saved state:', savedOlderDispute);
      setSelectedOlderInquiries(savedOlderDispute.selectedItems || {});
      setSelectedReason(savedOlderDispute.reason || '');
      setSelectedInstruction(savedOlderDispute.instruction || '');
      setIsOlderDisputeSaved(true);
    }
  }, [savedOlderDispute, isOlderDisputeSaved]);

  // CRITICAL FIX: Monitor for showOlderInquiries changes and restore saved state immediately
  useEffect(() => {
    if (savedOlderDispute && showOlderInquiries && !isOlderDisputeSaved) {
      console.log('🔄 EMERGENCY RESTORE: Older Inquiries section reopened, restoring saved state');
      setSelectedOlderInquiries(savedOlderDispute.selectedItems || {});
      setSelectedReason(savedOlderDispute.reason || '');
      setSelectedInstruction(savedOlderDispute.instruction || '');
      setIsOlderDisputeSaved(true);
    }
  }, [showOlderInquiries, savedOlderDispute, isOlderDisputeSaved]);

  useEffect(() => {
    if (savedRecentDispute && !isRecentDisputeSaved) {
      console.log('🔄 RESTORING Recent Inquiries saved state:', savedRecentDispute);
      setSelectedRecentInquiries(savedRecentDispute.selectedItems || {});
      setSelectedRecentReason(savedRecentDispute.reason || '');
      setSelectedRecentInstruction(savedRecentDispute.instruction || '');
      setIsRecentDisputeSaved(true);
    }
  }, [savedRecentDispute, isRecentDisputeSaved]);

  // CRITICAL FIX: Monitor for showRecentInquiries changes and restore saved state immediately
  useEffect(() => {
    if (savedRecentDispute && showRecentInquiries && !isRecentDisputeSaved) {
      console.log('🔄 EMERGENCY RESTORE: Recent Inquiries section reopened, restoring saved state');
      setSelectedRecentInquiries(savedRecentDispute.selectedItems || {});
      setSelectedRecentReason(savedRecentDispute.reason || '');
      setSelectedRecentInstruction(savedRecentDispute.instruction || '');
      setIsRecentDisputeSaved(true);
    }
  }, [showRecentInquiries, savedRecentDispute, isRecentDisputeSaved]);

  // Helper function to get inquiry data by key from both recent and older
  const getInquiryData = (inquiryKey: string) => {
    const { recent, older } = getInquiriesByBureau();

    // Check recent inquiries first
    for (const bureau in recent) {
      const inquiry = recent[bureau as keyof typeof recent].find(
        (inq: any) => inq.key === inquiryKey
      );
      if (inquiry) {
        return inquiry;
      }
    }

    // Check older inquiries
    for (const bureau in older) {
      const inquiry = older[bureau as keyof typeof older].find(
        (inq: any) => inq.key === inquiryKey
      );
      if (inquiry) {
        return inquiry;
      }
    }

    return null;
  };

  // Helper function to calculate actual bureau disputes for selected inquiries
  const calculateBureauDisputes = (selectedInquiries: { [key: string]: boolean }) => {
    const selectedKeys = Object.keys(selectedInquiries).filter(key => selectedInquiries[key]);
    return selectedKeys.length; // Each selected inquiry = 1 dispute (it only appears in one bureau)
  };

  // Helper function to get total bureau disputes for older inquiries
  const getOlderBureauDisputeCount = () => {
    return calculateBureauDisputes(selectedOlderInquiries);
  };

  // Helper function to get total bureau disputes for recent inquiries
  const getRecentBureauDisputeCount = () => {
    return calculateBureauDisputes(selectedRecentInquiries);
  };

  // Helper function to check if inquiry is tied to an open account
  const isInquiryTiedToOpenAccount = (inquiry: any) => {
    if (!creditData?.CREDIT_RESPONSE?.CREDIT_LIABILITY) {
      return false;
    }

    const accounts = Array.isArray(creditData.CREDIT_RESPONSE.CREDIT_LIABILITY)
      ? creditData.CREDIT_RESPONSE.CREDIT_LIABILITY
      : [creditData.CREDIT_RESPONSE.CREDIT_LIABILITY];

    const inquiryName = inquiry['@_Name']?.toLowerCase().trim();
    if (!inquiryName) {
      return false;
    }

    // Check if any account matches the inquiry name (open or closed)
    const hasMatch = accounts.some((account: any, index: number) => {
      const subscriberCode = account['@_SubscriberCode']?.toLowerCase().trim() || '';
      const accountOwner = account['@_AccountOwnershipType']?.toLowerCase().trim() || '';
      const accountStatus = account['@_AccountStatusType'];
      const creditorName = account._CREDITOR?.['@_Name']?.toLowerCase().trim() || '';

      // Check if account is open
      const isOpen = accountStatus !== 'C' && accountStatus !== 'Closed';

      // Enhanced name matching for CITI and other patterns
      let nameMatch = false;

      // Check multiple name fields for matches
      if (inquiryName.includes('citi')) {
        nameMatch =
          subscriberCode.includes('citi') ||
          subscriberCode.includes('citibank') ||
          creditorName.includes('citi') ||
          creditorName.includes('citibank');
      } else {
        // General matching logic
        nameMatch =
          (subscriberCode &&
            (subscriberCode.includes(inquiryName) || inquiryName.includes(subscriberCode))) ||
          (creditorName &&
            (creditorName.includes(inquiryName) || inquiryName.includes(creditorName))) ||
          (accountOwner &&
            (accountOwner.includes(inquiryName) || inquiryName.includes(accountOwner)));
      }

      if (nameMatch) {
        // Return true for any match (open or closed) - let user decide
        return true;
      }

      return false;
    });

    return hasMatch;
  };

  // AI typing animation function
  const typeText = async (
    text: string,
    setter: (text: string) => void,
    isTypingSetter: (isTyping: boolean) => void,
    speed = 30
  ) => {
    isTypingSetter(true);
    let currentText = '';
    for (let i = 0; i <= text.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, speed));
      currentText = text.substring(0, i);
      setter(currentText);
    }
    isTypingSetter(false);
  };

  // Auto-populate fields for older inquiries - SIMPLIFIED
  const autoPopulateOlderFields = async () => {
    const defaultReason = 'Inquiry not authorized by me';
    const defaultInstruction = 'Please remove this unauthorized inquiry immediately';

    // Use AI typing animation for both fields
    await typeText(defaultReason, setSelectedReason, setIsTypingReason, 30);
    
    // Small pause between reason and instruction
    await new Promise((resolve) => setTimeout(resolve, 200));
    
    await typeText(defaultInstruction, setSelectedInstruction, setIsTypingInstruction, 30);
    
    // Show arrow after typing completes
    setTimeout(() => {
      setShowOlderGuideArrow(true);
    }, 200);
  };

  // Auto-populate fields for recent inquiries - with AI typing animation
  const autoPopulateRecentFields = async () => {
    const defaultReason = 'Inquiry not authorized by me';
    const defaultInstruction = 'Please remove this unauthorized inquiry immediately';

    // Use AI typing animation for both fields
    await typeText(defaultReason, setSelectedRecentReason, setIsRecentTypingReason, 30);
    
    // Small pause between reason and instruction
    await new Promise((resolve) => setTimeout(resolve, 200));
    
    await typeText(defaultInstruction, setSelectedRecentInstruction, setIsRecentTypingInstruction, 30);
    
    // Show arrow after typing completes
    setTimeout(() => {
      setShowGuideArrow(true);
    }, 200);
  };

  // Get inquiries data and group by bureau
  const getInquiriesByBureau = () => {
    if (!creditData?.CREDIT_RESPONSE?.CREDIT_INQUIRY) {
      return {
        recent: { TransUnion: [], Equifax: [], Experian: [] },
        older: { TransUnion: [], Equifax: [], Experian: [] },
      };
    }

    const inquiries = creditData.CREDIT_RESPONSE.CREDIT_INQUIRY;
    const inquiryArray = Array.isArray(inquiries) ? inquiries : [inquiries];

    const currentDate = new Date('2025-06-18');
    const cutoffDate = new Date(currentDate);
    cutoffDate.setMonth(cutoffDate.getMonth() - 24);

    const recent = { TransUnion: [] as any[], Equifax: [] as any[], Experian: [] as any[] };
    const older = { TransUnion: [] as any[], Equifax: [] as any[], Experian: [] as any[] };

    inquiryArray.forEach((inquiry, index) => {
      if (inquiry?.['@_Date']) {
        const inquiryDate = new Date(inquiry['@_Date']);
        const key = `inquiry_${index}`;
        const bureau = inquiry.CREDIT_REPOSITORY?.['@_SourceType'] || 'Equifax';

        const inquiryWithKey = { ...inquiry, key };

        const isRecent = inquiryDate >= cutoffDate;

        if (isRecent) {
          if (recent[bureau as keyof typeof recent]) {
            recent[bureau as keyof typeof recent].push(inquiryWithKey);
          }
        } else {
          if (older[bureau as keyof typeof older]) {
            older[bureau as keyof typeof older].push(inquiryWithKey);
          }
        }
      }
    });

    return { recent, older };
  };

  const { recent: recentInquiries, older: olderInquiries } = getInquiriesByBureau();

  // Handle inquiry selection with warning modal
  const toggleOlderInquirySelection = (inquiryKey: string) => {
    const isCurrentlySelected = selectedOlderInquiries[inquiryKey];

    // If selecting (not deselecting), check for account matches first
    if (!isCurrentlySelected) {
      // Get inquiry data from older inquiries
      const { older } = getInquiriesByBureau();
      let inquiryData = null;

      for (const bureau in older) {
        inquiryData = older[bureau as keyof typeof older].find(
          (inq: any) => inq.key === inquiryKey
        );
        if (inquiryData) break;
      }

      // Check if this older inquiry is tied to an open account
      if (inquiryData && isInquiryTiedToOpenAccount(inquiryData)) {
        setWarningInquiryName(inquiryData['@_Name'] || 'this inquiry');
        setPendingInquirySelection(inquiryKey);
        setShowOlderInquiryWarning(true);
        return;
      } else {
        setShowOlderInquiryWarning(true);
        setPendingInquirySelection(inquiryKey);
        return;
      }
    }

    // If deselecting, proceed normally and reset saved state if previously saved
    setSelectedOlderInquiries((prev) => {
      const newSelected = { ...prev, [inquiryKey]: false };

      // If no inquiries are selected after this deselection, clear the form
      const hasAnySelected = Object.values(newSelected).some(Boolean);
      if (!hasAnySelected) {
        setSelectedReason('');
        setSelectedInstruction('');
        if (isOlderDisputeSaved) {
          setIsOlderDisputeSaved(false);
          setSavedOlderDispute(null);
          if (onHeaderReset) {
            onHeaderReset('older');
          }
        }
      } else if (isOlderDisputeSaved) {
        // If still has selections but was previously saved, reset saved state
        setIsOlderDisputeSaved(false);
        setSavedOlderDispute(null);
        if (onHeaderReset) {
          onHeaderReset('older');
        }
      }

      return newSelected;
    });
  };

  // Handle warning modal proceed for older inquiries
  const handleOlderWarningProceed = () => {
    setShowOlderInquiryWarning(false);

    if (pendingInquirySelection) {
      setSelectedOlderInquiries((prev) => {
        const newSelected = { ...prev, [pendingInquirySelection]: true };

        const wasEmpty = Object.values(prev).every((val) => !val);
        const hasNewSelections = Object.values(newSelected).some(Boolean);

        if (wasEmpty && hasNewSelections && !selectedReason && !selectedInstruction) {
          setTimeout(() => autoPopulateOlderFields(), 100);
        }

        return newSelected;
      });

      setPendingInquirySelection(null);
    }
  };

  // Handle warning modal proceed for recent inquiries
  const handleRecentWarningProceed = () => {
    setShowRecentInquiryWarning(false);

    if (pendingBulkSelection) {
      // Handle bulk selection after warning
      console.log('🔴 PROCEEDING WITH BULK SELECTION AFTER WARNING');
      setSelectedRecentInquiries(pendingBulkSelection);
      setPendingBulkSelection(null);

      // Auto-scroll to 20px above the Recent Inquiries card header after proceeding
      setTimeout(() => {
        const cardHeader = document.querySelector('[data-testid="recent-inquiries-header"]');
        if (cardHeader) {
          const rect = cardHeader.getBoundingClientRect();
          const targetScrollY = window.pageYOffset + rect.top - 20;
          window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
        }
      }, 100);

      if (!selectedRecentReason && !selectedRecentInstruction) {
        setTimeout(() => autoPopulateRecentFields(), 200);
      }
    } else if (pendingRecentInquirySelection) {
      // Handle individual selection after warning
      setSelectedRecentInquiries((prev) => {
        const newSelected = { ...prev, [pendingRecentInquirySelection]: true };

        const wasEmpty = Object.values(prev).every((val) => !val);
        const hasNewSelections = Object.values(newSelected).some(Boolean);

        if (wasEmpty && hasNewSelections && !selectedRecentReason && !selectedRecentInstruction) {
          setTimeout(() => autoPopulateRecentFields(), 100);
        }

        return newSelected;
      });

      setPendingRecentInquirySelection(null);
    }
  };

  const toggleRecentInquirySelection = (inquiryKey: string) => {
    // Check if we're trying to select an inquiry
    const isSelecting = !selectedRecentInquiries[inquiryKey];

    console.log('🔴 RECENT INQUIRY TOGGLE:', inquiryKey, 'isSelecting:', isSelecting);

    if (isSelecting) {
      // Get inquiry data from recent inquiries
      const { recent } = getInquiriesByBureau();
      let inquiryData = null;

      for (const bureau in recent) {
        inquiryData = recent[bureau as keyof typeof recent].find(
          (inq: any) => inq.key === inquiryKey
        );
        if (inquiryData) break;
      }

      console.log('🔴 INQUIRY DATA FOUND:', inquiryData);

      if (inquiryData && isInquiryTiedToOpenAccount(inquiryData)) {
        console.log('🔴 ACCOUNT MATCH - SHOWING WARNING FOR:', inquiryData['@_Name']);
        // Show warning modal for recent inquiries tied to open accounts
        setWarningInquiryName(inquiryData['@_Name'] || 'this inquiry');
        setPendingRecentInquirySelection(inquiryKey);
        setShowRecentInquiryWarning(true);
        return;
      }
    }

    setSelectedRecentInquiries((prev) => {
      const newSelected = { ...prev, [inquiryKey]: !prev[inquiryKey] };

      const wasEmpty = Object.values(prev).every((val) => !val);
      const hasNewSelections = Object.values(newSelected).some(Boolean);

      // If no inquiries are selected after this change, clear the form
      if (!hasNewSelections) {
        setSelectedRecentReason('');
        setSelectedRecentInstruction('');
        if (isRecentDisputeSaved) {
          setIsRecentDisputeSaved(false);
          setSavedRecentDispute(null);
          if (onHeaderReset) {
            onHeaderReset('recent');
          }
        }
      }
      // If selecting after having none selected, trigger autotype
      else if (
        wasEmpty &&
        hasNewSelections &&
        !selectedRecentReason &&
        !selectedRecentInstruction
      ) {
        setTimeout(() => autoPopulateRecentFields(), 100);
      }
      // If modifying selections after being saved, reset saved state
      else if (isRecentDisputeSaved && hasNewSelections) {
        setIsRecentDisputeSaved(false);
        setSavedRecentDispute(null);
        if (onHeaderReset) {
          onHeaderReset('recent');
        }
      }

      return newSelected;
    });
  };

  // Check form completion for arrows - match Personal Information timing exactly
  const checkOlderFormCompletionAndShowArrow = () => {
    // Don't show arrow during typing animation (matching Personal Information behavior)
    if (isTypingReason || isTypingInstruction) {
      return;
    }

    const hasSelectedItems = Object.values(selectedOlderInquiries).some(Boolean);
    const hasReason = selectedReason;
    const hasInstruction = selectedInstruction;

    if (hasSelectedItems && hasReason && hasInstruction && !isOlderDisputeSaved) {
      setShowOlderGuideArrow(true);
    } else {
      setShowOlderGuideArrow(false);
    }
  };

  // Check arrow with explicit values (for when state hasn't updated yet) - matching Personal Information
  const checkOlderFormCompletionAndShowArrowWithValues = (
    reasonText: string,
    instructionText: string
  ) => {
    const hasSelectedItems = Object.values(selectedOlderInquiries).some(Boolean);
    const hasReason = !!reasonText;
    const hasInstruction = !!instructionText;

    console.log('Arrow check with values - older inquiries:', {
      hasSelectedItems,
      hasReason,
      hasInstruction,
      reasonText,
      instructionText,
      isOlderDisputeSaved,
    });

    if (hasSelectedItems && hasReason && hasInstruction && !isOlderDisputeSaved) {
      setShowOlderGuideArrow(true);
    }
  };

  const checkRecentFormCompletionAndShowArrow = () => {
    // Don't show arrow during typing animation (matching Personal Information and Older Inquiries behavior)
    if (isRecentTypingReason || isRecentTypingInstruction) {
      return;
    }

    const hasReason = selectedRecentReason;
    const hasInstruction = selectedRecentInstruction;
    const hasSelectedItems = Object.values(selectedRecentInquiries).some(Boolean);

    if (hasSelectedItems && hasReason && hasInstruction && !isRecentDisputeSaved) {
      setShowGuideArrow(true);
    } else {
      setShowGuideArrow(false);
    }
  };

  // Check arrow with explicit values for Recent Inquiries (matching Personal Information pattern)
  const checkRecentFormCompletionAndShowArrowWithValues = (
    reasonText: string,
    instructionText: string
  ) => {
    const hasSelectedItems = Object.values(selectedRecentInquiries).some(Boolean);
    const hasReason = !!reasonText;
    const hasInstruction = !!instructionText;

    console.log('Arrow check with values - recent inquiries:', {
      hasSelectedItems,
      hasReason,
      hasInstruction,
      reasonText,
      instructionText,
      isRecentDisputeSaved,
    });

    if (hasSelectedItems && hasReason && hasInstruction && !isRecentDisputeSaved) {
      setShowGuideArrow(true);
    }
  };

  // This function is not used - save logic is in button click handler

  // Handle section expansion with scroll to "1" circle
  const handleOlderInquiriesToggle = () => {
    setShowOlderInquiries(!showOlderInquiries);
    
    if (!showOlderInquiries) {
      // Opening the section - scroll to "1" circle
      setTimeout(() => {
        const elements = document.querySelectorAll('*');
        for (const element of elements) {
          if (element.textContent?.includes('Choose unauthorized inquiries to dispute')) {
            const parent = element.closest('.flex.items-center.gap-3');
            if (parent) {
              const circle = parent.querySelector('.circle-badge-blue, .circle-badge-green');
              if (circle && circle.textContent === '1') {
                const rect = circle.getBoundingClientRect();
                const targetScrollY = window.pageYOffset + rect.top - 20;
                window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
                return;
              }
            }
          }
        }
      }, 100);
    }
  };

  // Date formatting
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Bureau color coding
  const getBureauColor = (bureau: string): string => {
    switch (bureau.toLowerCase()) {
      case 'transunion':
        return 'text-cyan-700';
      case 'equifax':
        return 'text-red-600';
      case 'experian':
        return 'text-blue-800';
      default:
        return 'text-gray-600';
    }
  };

  // Render bureau section with inquiries
  const renderBureauSection = (bureau: string, inquiries: any[], isRecent: boolean) => {
    const selectedItems = isRecent ? selectedRecentInquiries : selectedOlderInquiries;
    const isDisputeSaved = isRecent ? isRecentDisputeSaved : isOlderDisputeSaved;

    return (
      <div key={bureau} className="space-y-4">
        <div className={`flex items-center gap-2 mb-2 ${isRecent ? 'mt-6' : 'mt-3'}`}>
          <h4 className={`font-bold ${getBureauColor(bureau)}`}>{bureau}</h4>
        </div>

        {inquiries.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 h-[100px] flex flex-col items-center justify-center">
            <ThumbsUp className="w-8 h-8 text-green-600 mb-2" />
            <p className="text-sm text-center text-green-700 font-bold">Clean slate!</p>
            <p className="text-xs text-center text-gray-500">No recent inquiries</p>
          </div>
        ) : (
          <div className="space-y-2">
            {inquiries.map((inquiry) => {
              const isSelected = selectedItems[inquiry.key];

              return (
                <div
                  key={inquiry.key}
                  className={`
                    border rounded-lg p-3 h-[100px] cursor-pointer transition-all duration-200
                    ${
                      isDisputeSaved
                        ? isSelected
                          ? 'border-3 border-green-500 bg-green-50'
                          : 'bg-green-50 border border-green-200'
                        : isSelected
                          ? 'border-3 border-red-500 bg-white'
                          : 'bg-gray-50 border border-gray-200 hover:border-gray-300'
                    }
                  `}
                  onClick={() =>
                    isRecent
                      ? toggleRecentInquirySelection(inquiry.key)
                      : toggleOlderInquirySelection(inquiry.key)
                  }
                >
                  <div className="flex gap-2 h-full">
                    <input
                      type="checkbox"
                      className="flex-shrink-0 mt-0.5"
                      checked={isSelected}
                      onChange={() => {}}
                    />
                    <div className="flex-1 min-w-0 flex items-center">
                      <div className="w-full">
                        <p className="text-xs font-bold mb-1 truncate">
                          {inquiry['@_Name'] || 'Unknown Creditor'}
                        </p>
                        <p className="text-xs text-gray-600 mb-1">
                          {formatDate(inquiry['@_Date'])}
                        </p>
                        <p className="text-xs text-gray-500 mb-1">
                          {inquiry['@CreditBusinessType'] || 'Unknown Type'}
                        </p>
                        <p
                          className={`text-xs flex items-center gap-1 ${isRecent ? 'text-orange-600' : 'text-green-600'}`}
                        >
                          {isRecent ? (
                            <>
                              <AlertTriangle className="w-3 h-3" />
                              May Impact Score
                            </>
                          ) : (
                            <>
                              <ThumbsUp className="w-3 h-3" />
                              No Impact to Score
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // Render dispute form - EXACT replica from Personal Information
  const renderDisputeForm = (isRecent: boolean) => {
    const reason = isRecent ? selectedRecentReason : selectedReason;
    const instruction = isRecent ? selectedRecentInstruction : selectedInstruction;
    const setReason = isRecent ? setSelectedRecentReason : setSelectedReason;
    const setInstruction = isRecent ? setSelectedRecentInstruction : setSelectedInstruction;
    const selectedItems = isRecent ? selectedRecentInquiries : selectedOlderInquiries;
    const hasSelectedItems = Object.values(selectedItems).some(Boolean);
    const isTypingReasonState = isRecent ? isRecentTypingReason : isTypingReason;
    const isTypingInstructionState = isRecent ? isRecentTypingInstruction : isTypingInstruction;
    const showArrow = isRecent ? showGuideArrow : showOlderGuideArrow;
    const isDisputeSavedState = isRecent ? isRecentDisputeSaved : isOlderDisputeSaved;

    if (!hasSelectedItems) return null;

    const disputeReasons = [
      'Inquiry not authorized by me',
      'I never applied for credit with this company',
      'This inquiry is older than 2 years',
      'This is a duplicate inquiry',
      'I was only shopping for rates',
      'This inquiry was made without my permission',
      'This is fraudulent inquiry activity',
      'Other (specify below)',
    ];

    const disputeInstructions = [
      'Please remove this unauthorized inquiry immediately',
      'Delete this inquiry as I never applied for credit',
      'Remove this outdated inquiry from my report',
      'Please delete this duplicate inquiry',
      'Remove this inquiry as I was only rate shopping',
      'Delete this unauthorized inquiry from my credit file',
      'Remove this fraudulent inquiry immediately',
      'Other (specify below)',
    ];

    return (
      <div className="mt-4">
        <div
          className={`pt-4 rounded-lg py-4 ${isDisputeSavedState ? 'bg-green-50' : 'bg-red-50'}`}
        >
          <div className="border-t border-gray-200 mb-4"></div>
          <div className="flex items-start gap-2 mb-4 mt-2">
            <div
              className={`transition-colors duration-300 ${
                isDisputeSavedState ? 'circle-badge-green' : 'circle-badge-blue'
              }`}
            >
              2
            </div>
            <h4 className="font-semibold text-gray-900">
              {isDisputeSavedState ? (() => {
                // Count selected inquiries to determine singular/plural
                const olderCount = Object.values(selectedOlderInquiries).filter(Boolean).length;
                const recentCount = Object.values(selectedRecentInquiries).filter(Boolean).length;
                const totalCount = olderCount + recentCount;
                return totalCount === 1 ? 'Dispute Saved' : 'Disputes Saved';
              })() : 'Dispute Module'}
            </h4>
          </div>

          <div className="space-y-4">
            {/* Reason Selection */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">Dispute Reason</label>
              </div>
              {isTypingReasonState ? (
                <div className="relative">
                  <div className="absolute -top-7 right-0 flex items-center gap-1 text-blue-600 text-xs z-10">
                    <div className="w-1 h-1 bg-blue-600 rounded-full animate-pulse"></div>
                    <span>AI typing</span>
                  </div>
                  <div className="w-full p-3 border border-red-500 rounded-md bg-red-50 text-gray-900 min-h-[42px] flex items-center">
                    {reason || 'AI is typing...'}
                  </div>
                </div>
              ) : (
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger
                    className={`w-full ${
                      isDisputeSavedState && Object.values(selectedItems).some(Boolean)
                        ? 'border-green-500'
                        : Object.values(selectedItems).some(Boolean)
                          ? 'border-red-500'
                          : 'border-gray-300'
                    }`}
                  >
                    <SelectValue placeholder="Select a dispute reason..." />
                  </SelectTrigger>
                  <SelectContent>
                    {disputeReasons.map((reasonOption, index) => (
                      <SelectItem key={index} value={reasonOption}>
                        {reasonOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Instruction Selection */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">Dispute Instruction</label>
              </div>
              {isTypingInstructionState ? (
                <div className="relative">
                  <div className="absolute -top-7 right-0 flex items-center gap-1 text-blue-600 text-xs z-10">
                    <div className="w-1 h-1 bg-blue-600 rounded-full animate-pulse"></div>
                    <span>AI typing</span>
                  </div>
                  <div className="w-full p-3 border border-red-500 rounded-md bg-red-50 text-gray-900 min-h-[42px] flex items-center">
                    {instruction || 'AI is typing...'}
                  </div>
                </div>
              ) : (
                <Select value={instruction} onValueChange={setInstruction}>
                  <SelectTrigger
                    className={`w-full ${
                      isDisputeSavedState && Object.values(selectedItems).some(Boolean)
                        ? 'border-green-500'
                        : Object.values(selectedItems).some(Boolean)
                          ? 'border-red-500'
                          : 'border-gray-300'
                    }`}
                  >
                    <SelectValue placeholder="Select dispute instructions..." />
                  </SelectTrigger>
                  <SelectContent>
                    {disputeInstructions.map((instructionOption, index) => (
                      <SelectItem key={index} value={instructionOption}>
                        {instructionOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          {/* Save Button Section */}
          <div className="flex gap-2 justify-between items-center pt-4">
            {hasSelectedItems && !isDisputeSavedState && !showArrow ? (
              <div className="warning-container">
                <AlertTriangle className="hidden md:block w-4 h-4 warning-icon" />
                <span className="text-xs md:text-sm font-medium warning-text">
                  <span className="md:hidden">Complete Step 2</span>
                  <span className="hidden md:inline">Complete Reason & Instruction</span>
                </span>
              </div>
            ) : (
              <div></div>
            )}
            <div className="flex items-center gap-2 relative overflow-visible">
              {/* Flying Arrow Guide */}
              {showArrow && (
                <div
                  className="absolute right-full top-1/2 transform -translate-y-1/2 z-50 pr-2 pointer-events-none"
                  style={{ width: 'calc(100vw - 160px)', left: 'calc(-100vw + 140px)' }}
                >
                  <div className="flex items-center animate-fly-arrow">
                    <div className="w-16 h-1 bg-blue-600"></div>
                    <div className="w-0 h-0 border-l-[10px] border-t-[6px] border-b-[6px] border-l-blue-600 border-t-transparent border-b-transparent"></div>
                  </div>
                </div>
              )}
              <span
                className={`mr-1 transition-colors duration-300 ${
                  isDisputeSavedState ? 'circle-badge-green' : 'circle-badge-blue'
                }`}
              >
                3
              </span>
              <Button
                onClick={() => {
                  console.log(
                    'SAVE BUTTON CLICKED - isRecent:',
                    isRecent,
                    'isDisputeSavedState:',
                    isDisputeSavedState
                  );

                  // If already saved, still trigger choreography but maintain saved state
                  if (isDisputeSavedState) {
                    console.log(
                      'SAVE CLICKED - Already saved inquiry dispute, triggering choreography'
                    );
                    return;
                  }

                  if (isRecent) {
                    const disputeData = {
                      reason: selectedRecentReason,
                      instruction: selectedRecentInstruction,
                      selectedItems: selectedRecentInquiries,
                    };
                    
                    // SAVE FIRST - Priority is data integrity
                    setSavedRecentDispute(disputeData);
                    setIsRecentDisputeSaved(true);

                    // Call parent callback to trigger header green checkmark
                    if (onDisputeSaved) {
                      onDisputeSaved({
                        reason: selectedRecentReason,
                        instruction: selectedRecentInstruction,
                        selectedItems: selectedRecentInquiries,
                        isRecentInquiries: true,
                      });
                    }

                    // NOW add choreography AFTER saving is complete
                    // Box turns green immediately (already happened above)
                    console.log('Recent inquiries dispute saved, starting choreography');

                    // Scroll to 20px above "Hard Inquiries" section headline (immediate)
                    const hardInquiriesSection = document.querySelector('[data-section="inquiries"]');

                    if (hardInquiriesSection) {
                      const rect = hardInquiriesSection.getBoundingClientRect();
                      const targetScrollY = window.pageYOffset + rect.top - 20;
                      window.scrollTo({ top: targetScrollY, behavior: 'smooth' });

                      // Wait for scroll to complete (300ms)
                      setTimeout(() => {
                        // Pause 1/2 second before collapse (500ms)
                        setTimeout(() => {
                          // Collapse Recent Inquiries section
                          setShowRecentInquiries(false);
                          
                          // Wait 1/2 second after collapse (500ms)
                          setTimeout(() => {
                            // Collapse both sections into combined box
                            setShowCombinedCollapsedBox(true);
                            setHasEverShownCombinedBox(true);
                            
                            // Wait 1/2 second after final collapse (500ms)
                            setTimeout(() => {
                              // Scroll to 20px above "Credit Accounts" section
                              const creditAccountsSection = document.querySelector('[data-section="accounts"]');
                              if (creditAccountsSection) {
                                const rect = creditAccountsSection.getBoundingClientRect();
                                const targetScrollY = window.pageYOffset + rect.top - 20;
                                window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
                              }
                            }, 500);
                          }, 500);
                        }, 500);
                      }, 300);
                    }
                  } else {
                    // Older inquiries save with choreography
                    console.log('OLDER INQUIRIES SAVE TRIGGERED');

                    const selectedItems = Object.keys(selectedOlderInquiries)
                      .filter((key) => selectedOlderInquiries[key])
                      .reduce(
                        (acc, key) => {
                          acc[key] = true;
                          return acc;
                        },
                        {} as { [key: string]: boolean }
                      );

                    const disputeData = {
                      reason: selectedReason,
                      instruction: selectedInstruction,
                      selectedItems,
                    };
                    
                    // SAVE FIRST - Priority is data integrity
                    setSavedOlderDispute(disputeData);
                    setIsOlderDisputeSaved(true);

                    // Call parent callback if available
                    if (onDisputeSaved) {
                      onDisputeSaved(disputeData);
                    }

                    // NOW add choreography AFTER saving is complete
                    // Box turns green immediately (already happened above)
                    console.log('Dispute saved, starting choreography');

                    // Scroll to 20px above "Hard Inquiries" section headline (immediate)
                    const hardInquiriesSection = document.querySelector('[data-section="inquiries"]');

                    if (hardInquiriesSection) {
                      const rect = hardInquiriesSection.getBoundingClientRect();
                      const targetScrollY = window.pageYOffset + rect.top - 20;
                      window.scrollTo({ top: targetScrollY, behavior: 'smooth' });

                      // Wait for scroll to complete (300ms)
                      setTimeout(() => {
                        // Pause 1/2 second before collapse (500ms)
                        setTimeout(() => {
                          // Collapse section
                          setShowOlderInquiries(false);
                          
                          // Wait half a second after collapse (500ms)
                          setTimeout(() => {
                            // Scroll to "1" circle below "Hard Inquiries"
                            const elements = document.querySelectorAll('*');
                            for (const element of elements) {
                              if (element.textContent?.includes('Choose unauthorized inquiries to dispute')) {
                                const parent = element.closest('.flex.items-center.gap-3');
                                if (parent) {
                                  const circle = parent.querySelector('.circle-badge-blue, .circle-badge-green');
                                  if (circle && circle.textContent === '1') {
                                    const rect = circle.getBoundingClientRect();
                                    const targetScrollY = window.pageYOffset + rect.top - 20;
                                    window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
                                    return;
                                  }
                                }
                              }
                            }
                          }, 500);
                        }, 500);
                      }, 300);
                    }
                  }
                }}
                disabled={!Object.values(selectedItems).some(Boolean) || !reason || !instruction}
                className={`${
                  isDisputeSavedState
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white px-4 py-2 rounded-md disabled:bg-gray-400 transition-colors duration-200 w-[190px] h-10 flex items-center justify-center`}
              >
                {isDisputeSavedState ? (
                  <>
                    <span className="text-white text-sm mr-2">✓</span>
                    <span>Dispute Saved</span>
                  </>
                ) : (
                  'Save Dispute and Continue'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Get total counts
  const getTotalOlderCount = () => {
    return Object.values(olderInquiries).reduce(
      (sum, bureauInquiries) => sum + bureauInquiries.length,
      0
    );
  };

  const getTotalRecentCount = () => {
    return Object.values(recentInquiries).reduce(
      (sum, bureauInquiries) => sum + bureauInquiries.length,
      0
    );
  };

  // useEffect hooks
  useEffect(() => {
    checkOlderFormCompletionAndShowArrow();
  }, [
    selectedOlderInquiries,
    selectedReason,
    selectedInstruction,
    isOlderDisputeSaved,
    isTypingReason,
    isTypingInstruction,
  ]);

  useEffect(() => {
    checkRecentFormCompletionAndShowArrow();
  }, [
    selectedRecentInquiries,
    selectedRecentReason,
    selectedRecentInstruction,
    isRecentDisputeSaved,
    isRecentTypingReason,
    isRecentTypingInstruction,
  ]);

  // REMOVED: Duplicate useEffect hooks that were causing state interference
  // The primary useEffect hooks at the top of the component handle all state restoration

  // Calculate combined dispute information
  const getCombinedDisputeInfo = () => {
    const olderCount = savedOlderDispute
      ? Object.keys(savedOlderDispute.selectedItems || {}).length
      : 0;
    const recentCount = savedRecentDispute
      ? Object.keys(savedRecentDispute.selectedItems || {}).length
      : 0;
    const totalCount = olderCount + recentCount;
    
    // Only count actual disputes saved, not bureau multipliers
    const totalDisputes = totalCount;

    return {
      olderCount,
      recentCount,
      totalCount,
      totalDisputes,
      hasOlderDispute: !!savedOlderDispute,
      hasRecentDispute: !!savedRecentDispute,
    };
  };

  const combinedInfo = getCombinedDisputeInfo();

  return (
    <div className="space-y-6">
      {/* Elegant Collapse Button - Shows only after combined box has been shown and sections reopened */}
      {!showCombinedCollapsedBox &&
        hasEverShownCombinedBox &&
        (combinedInfo.hasOlderDispute || combinedInfo.hasRecentDispute) && (
          <div className="flex justify-center mb-4">
            <Button
              onClick={() => {
                setShowCombinedCollapsedBox(true);
                setHasEverShownCombinedBox(true);
                setShowOlderInquiries(false);
                setShowRecentInquiries(false);
              }}
              className="bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 px-4 py-1.5 rounded-md text-xs transition-colors duration-200 flex items-center gap-1.5"
            >
              <span className="font-medium">Collapse All Inquiries</span>
              <ChevronUp className="w-3 h-3" />
            </Button>
          </div>
        )}

      {/* Combined Collapsed Box - Shows when both sections are saved and collapsed */}
      {showCombinedCollapsedBox &&
        (combinedInfo.hasOlderDispute || combinedInfo.hasRecentDispute) && (
          <Card className="border border-green-300 bg-green-50 transition-all duration-300">
            <CardHeader
              className="cursor-pointer transition-colors collapsed-box-height hover:bg-green-100"
              onClick={() => {
                setShowCombinedCollapsedBox(false);
                // Show individual collapsed boxes, not expanded sections
                setShowOlderInquiries(false);
                setShowRecentInquiries(false);
              }}
            >
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="text-base font-semibold text-green-700 leading-5">
                      Hard Inquiries
                    </div>
                    <div className="text-sm text-green-600 leading-4">
                      {/* Show comprehensive information about what's in this box */}
                      {(() => {
                        const totalOlderInquiries = getTotalOlderCount();
                        const totalRecentInquiries = getTotalRecentCount();
                        const disputedRecent = combinedInfo.hasRecentDispute ? combinedInfo.recentCount : 0;
                        const disputedOlder = combinedInfo.hasOlderDispute ? combinedInfo.olderCount : 0;
                        
                        let description = '';
                        
                        // Add total counts
                        if (totalOlderInquiries > 0 && totalRecentInquiries > 0) {
                          description = `${totalOlderInquiries} older + ${totalRecentInquiries} recent inquiries`;
                        } else if (totalOlderInquiries > 0) {
                          description = `${totalOlderInquiries} older inquiries`;
                        } else if (totalRecentInquiries > 0) {
                          description = `${totalRecentInquiries} recent inquiries`;
                        }
                        
                        // Add what was disputed
                        if (disputedRecent > 0 && disputedOlder > 0) {
                          description += ` • ${disputedRecent} recent + ${disputedOlder} older disputed`;
                        } else if (disputedRecent > 0) {
                          description += ` • ${disputedRecent} recent disputed`;
                        } else if (disputedOlder > 0) {
                          description += ` • ${disputedOlder} older disputed`;
                        }
                        
                        return description;
                      })()}
                    </div>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-blue-600 flex-shrink-0" />
              </div>
            </CardHeader>
          </Card>
        )}

      {/* Step 1 Instruction - Only show if neither section is saved and not showing combined box */}
      {!showCombinedCollapsedBox && !(isRecentDisputeSaved && isOlderDisputeSaved) && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="circle-badge-blue">1</div>
            <span className="text-base text-gray-700 font-bold">
              Choose unauthorized inquiries to dispute (optional)
            </span>
          </div>
          <span className="text-xs text-gray-500">
            Inquiries older than 24 months do not impact the score
          </span>
        </div>
      )}

      {/* Individual Inquiry Sections - Hide when showing combined box */}
      {!showCombinedCollapsedBox && (
        <>
          {/* Older Inquiries Section */}
          <Card
            className={`
            ${isOlderDisputeSaved ? 'border border-green-300 bg-green-50' : Object.values(selectedOlderInquiries).some(Boolean) ? 'border border-red-200' : 'border border-gray-200'}
            transition-all duration-75
          `}
          >
            <CardHeader
              className={`cursor-pointer transition-colors collapsed-box-height ${
                isOlderDisputeSaved ? 'hover:bg-green-100' : Object.values(selectedOlderInquiries).some(Boolean) ? 'hover:bg-red-75' : 'hover:bg-gray-50'
              }`}
              onClick={handleOlderInquiriesToggle}
            >
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isOlderDisputeSaved ? (
                    <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  ) : (
                    <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0"></div>
                  )}
                  <div className="flex flex-col justify-center">
                    <div
                      className={`text-base font-semibold leading-5 ${isOlderDisputeSaved ? 'text-green-700' : 'text-gray-900'}`}
                    >
                      {isOlderDisputeSaved
                        ? `${Object.values(selectedOlderInquiries).filter(Boolean).length} Older Inquiry Dispute${Object.values(selectedOlderInquiries).filter(Boolean).length !== 1 ? 's' : ''} Saved`
                        : `${getTotalOlderCount()} Older Inquiries`}
                    </div>
                    <div className={`text-sm font-normal leading-4 ${isOlderDisputeSaved ? 'text-green-600' : 'text-green-600'}`}>
                      {isOlderDisputeSaved
                        ? `${getTotalOlderCount()} older inquiries • ${getOlderBureauDisputeCount()} bureau disputes saved`
                        : 'No Impact To Score'}
                    </div>
                  </div>
                </div>
                {!showCombinedCollapsedBox && (
                  <ChevronDown
                    className={`w-4 h-4 flex-shrink-0 transition-transform ${showOlderInquiries ? 'rotate-180' : ''} text-blue-600`}
                  />
                )}
              </div>
            </CardHeader>

            {showOlderInquiries && (
              <CardContent
                className={`
            pt-0 rounded-b-lg
            ${Object.values(selectedOlderInquiries).some(Boolean) && !isOlderDisputeSaved ? 'bg-red-50' : ''}
            ${isOlderDisputeSaved ? 'bg-green-50' : ''}
          `}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {renderBureauSection('TransUnion', olderInquiries.TransUnion, false)}
                  {renderBureauSection('Equifax', olderInquiries.Equifax, false)}
                  {renderBureauSection('Experian', olderInquiries.Experian, false)}
                </div>
                {renderDisputeForm(false)}
              </CardContent>
            )}
          </Card>

          {/* Recent Inquiries Section */}
          <Card
            className={`
        ${
          isRecentDisputeSaved
            ? 'border border-green-300 bg-green-50'
            : Object.values(selectedRecentInquiries).some(Boolean)
              ? 'border border-red-200 bg-white'
              : 'border border-gray-200'
        }
        transition-all duration-75
      `}
          >
            <CardHeader
              data-testid="recent-inquiries-header"
              className={`cursor-pointer transition-colors collapsed-box-height ${
                isRecentDisputeSaved ? 'hover:bg-green-100' : Object.values(selectedRecentInquiries).some(Boolean) ? 'hover:bg-red-75' : 'hover:bg-gray-50'
              }`}
              onClick={() => setShowRecentInquiries(!showRecentInquiries)}
            >
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isRecentDisputeSaved ? (
                    <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  ) : (
                    <div className="w-3 h-3 rounded-full bg-orange-500 flex-shrink-0"></div>
                  )}
                  <div className="flex flex-col justify-center">
                    <div
                      className={`text-base font-semibold leading-5 ${isRecentDisputeSaved ? 'text-green-700' : 'text-gray-900'}`}
                    >
                      {isRecentDisputeSaved
                        ? `${Object.values(selectedRecentInquiries).filter(Boolean).length} Recent Inquiries Dispute${Object.values(selectedRecentInquiries).filter(Boolean).length !== 1 ? 's' : ''} Saved`
                        : `${getTotalRecentCount()} Recent ${getTotalRecentCount() === 1 ? 'Inquiry' : 'Inquiries'}`}
                    </div>
                    <div className={`text-sm font-normal leading-4 ${isRecentDisputeSaved ? 'text-green-600' : 'text-orange-600'}`}>
                      {isRecentDisputeSaved
                        ? `${getTotalRecentCount()} recent inquiries • ${getRecentBureauDisputeCount()} bureau disputes saved`
                        : 'May Impact Credit Score'}
                    </div>
                  </div>
                </div>
                {!showCombinedCollapsedBox && (
                  <ChevronDown
                    className={`w-4 h-4 flex-shrink-0 transition-transform ${showRecentInquiries ? 'rotate-180' : ''} text-blue-600`}
                  />
                )}
              </div>
            </CardHeader>

            {showRecentInquiries && (
              <CardContent
                className={`
            pt-0 rounded-b-lg
            ${Object.values(selectedRecentInquiries).some(Boolean) && !isRecentDisputeSaved ? 'bg-red-50' : ''}
            ${isRecentDisputeSaved ? 'bg-green-50' : ''}
          `}
              >
                <div className="flex justify-end mb-0 mt-2">
                  <Button
                    size="sm"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 h-8 text-sm font-medium"
                    onClick={() => {
                      console.log('🔴 SELECT ALL SCORE-IMPACT ITEMS CLICKED');

                      // Get all recent inquiries
                      const allInquiries = Object.values(recentInquiries).flat();
                      console.log('🔴 ALL RECENT INQUIRIES:', allInquiries);

                      // Check each inquiry for account matches
                      let hasAccountMatches = false;
                      const inquiriesWithMatches = [];

                      for (const inquiry of allInquiries) {
                        if (isInquiryTiedToOpenAccount(inquiry)) {
                          hasAccountMatches = true;
                          inquiriesWithMatches.push(inquiry);
                          console.log('🔴 ACCOUNT MATCH FOUND FOR:', inquiry['@_Name']);
                        }
                      }

                      if (hasAccountMatches) {
                        // Show warning modal for bulk selection with account matches
                        console.log('🔴 SHOWING BULK WARNING FOR ACCOUNT MATCHES');
                        setWarningInquiryName(
                          `${inquiriesWithMatches.length} inquiries that match existing accounts`
                        );
                        // Store all inquiries for bulk selection after warning
                        const allSelected = allInquiries.reduce(
                          (acc, inquiry) => {
                            acc[inquiry.key] = true;
                            return acc;
                          },
                          {} as { [key: string]: boolean }
                        );
                        setPendingBulkSelection(allSelected);
                        setShowRecentInquiryWarning(true);
                      } else {
                        // No account matches, proceed with selection
                        console.log('🔴 NO ACCOUNT MATCHES - PROCEEDING WITH BULK SELECTION');
                        const allSelected = allInquiries.reduce(
                          (acc, inquiry) => {
                            acc[inquiry.key] = true;
                            return acc;
                          },
                          {} as { [key: string]: boolean }
                        );

                        setSelectedRecentInquiries(allSelected);

                        // Only scroll if no warning modal will appear
                        const hasWarnings = Object.keys(allSelected).some(key => 
                          shouldShowRecentInquiryWarning(key, false)
                        );
                        
                        if (!hasWarnings) {
                          setTimeout(() => {
                            const cardHeader = document.querySelector('[data-testid="recent-inquiries-header"]');
                            if (cardHeader) {
                              const rect = cardHeader.getBoundingClientRect();
                              const targetScrollY = window.pageYOffset + rect.top - 20;
                              window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
                            }
                          }, 100);
                        }

                        if (!selectedRecentReason && !selectedRecentInstruction) {
                          setTimeout(() => autoPopulateRecentFields(), 200);
                        }
                      }
                    }}
                  >
                    Select All Score-Impact Items
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {renderBureauSection('TransUnion', recentInquiries.TransUnion, true)}
                  {renderBureauSection('Equifax', recentInquiries.Equifax, true)}
                  {renderBureauSection('Experian', recentInquiries.Experian, true)}
                </div>
                {renderDisputeForm(true)}
              </CardContent>
            )}
          </Card>
        </>
      )}

      {/* Warning Modal for Older Inquiries */}
      {showOlderInquiryWarning && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => {
              setShowOlderInquiryWarning(false);
              setPendingInquirySelection(null);
            }}
          />
          <div className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] bg-white rounded-lg p-8 shadow-2xl min-h-[320px]">
            {/* X Close Button */}
            <button
              onClick={() => {
                setShowOlderInquiryWarning(false);
                setPendingInquirySelection(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header with Warning Icon */}
            <div className="flex items-start gap-3 mb-6 -ml-2">
              <div className="flex-shrink-0">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  No Score Benefit — Potential Score Damage
                </h3>

                {/* Main Content */}
                <div className="text-gray-700 mb-6">
                  <p className="mb-4">
                    This inquiry is more than 24 months old, so it no longer impacts your credit
                    score.
                  </p>
                  <p className="mb-4">
                    Disputing it won&apos;t help your score — and if there&apos;s an open account linked to
                    it, you could lose that account, which can hurt your score.
                  </p>
                  <p className="mb-4 font-semibold text-red-700">
                    We recommend that you do not dispute this inquiry.
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowOlderInquiryWarning(false);
                  setPendingInquirySelection(null);
                }}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg font-medium flex items-center justify-center transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleOlderWarningProceed}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium flex items-center justify-center transition-colors"
              >
                Proceed Anyway
              </button>
            </div>
          </div>
        </>
      )}

      {/* Warning Modal for Recent Inquiries */}
      {showRecentInquiryWarning && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => {
              setShowRecentInquiryWarning(false);
              setPendingRecentInquirySelection(null);
              setPendingBulkSelection(null);
            }}
          />
          <div className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] bg-white rounded-lg p-8 shadow-2xl">
            {/* X Close Button */}
            <button
              onClick={() => {
                setShowRecentInquiryWarning(false);
                setPendingRecentInquirySelection(null);
                setPendingBulkSelection(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header with Warning Icon */}
            <div className="flex items-start gap-3 mb-6">
              <div className="flex-shrink-0">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Warning: Multiple Account Matches
                </h3>

                {/* Main Content */}
                <div className="text-gray-700 mb-6">
                  <p className="mb-4">
                    The inquiry from &quot;{warningInquiryName}&quot; appears to match an open account on your
                    credit report.
                  </p>

                  <p className="mb-4 font-medium">Disputing this inquiry may:</p>

                  <ul className="list-disc pl-6 mb-4 space-y-1">
                    <li>Potentially close your open account</li>
                    <li>Reduce your available credit</li>
                    <li>Negatively impact your credit score</li>
                    <li>Affect your credit utilization ratio</li>
                  </ul>

                  <p className="text-red-600 font-bold">
                    Only dispute this inquiry if you&apos;re certain it was unauthorized or if you&apos;re
                    willing to accept these risks.
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRecentInquiryWarning(false);
                  setPendingRecentInquirySelection(null);
                  setPendingBulkSelection(null);
                }}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg font-medium flex items-center justify-center transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRecentWarningProceed}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium flex items-center justify-center transition-colors"
              >
                Proceed Anyway
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
