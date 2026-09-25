'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { Tabs as TabsPrimitive } from 'radix-ui';
import { tabsListVariants, tabsTriggerVariants } from './tabs-variants';

// Variants for TabsContent
const tabsContentVariants = cva(
  'mt-2.5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

// Context
type TabsContextType = {
  variant?: 'default' | 'button' | 'line';
  size?: 'lg' | 'sm' | 'xs' | 'md';
};
const TabsContext = React.createContext<TabsContextType>({
  variant: 'default',
  size: 'md',
});

// Components
function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root data-slot="tabs" className={cn('', className)} {...props} />;
}

function TabsList({
  className,
  variant = 'default',
  shape = 'default',
  size = 'md',
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsContext.Provider value={{ variant: variant || 'default', size: size || 'md' }}>
      <TabsPrimitive.List
        data-slot="tabs-list"
        className={cn(tabsListVariants({ variant, shape, size }), className)}
        {...props}
      />
    </TabsContext.Provider>
  );
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const { variant, size } = React.useContext(TabsContext);

  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(tabsTriggerVariants({ variant, size }), className)}
      {...props}
    />
  );
}

function TabsContent({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content> & VariantProps<typeof tabsContentVariants>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(tabsContentVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
// Added for this site: the variants live in ./tabs-variants.ts (not a client module), so the
// page navigation can reuse the tab styles without shipping this component to the browser.
export { tabsListVariants, tabsTriggerVariants };
