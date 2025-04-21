import { AnimatePresence, motion } from 'framer-motion';

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15,
        }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
};

const AnimatedList = ({ 
    items, 
    renderItem, 
    itemsClassname, 
    gridClassname, 
    getItemProps = () => ({}) 
    }) => {
        return (
            <motion.ul
                className={gridClassname}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <AnimatePresence>
                    {items.map((item, i) => {
                        const props = getItemProps(item, i);
                        const { ref, ...restProps } = props;
    
                        return (
                            <motion.li
                                key={item.id}
                                ref={ref}
                                className={itemsClassname}
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{ duration: 0.3, delay: i * 0.05 }}
                                {...restProps}
                            >
                                {renderItem(item, i)}
                            </motion.li>
                        );
                    })}
                </AnimatePresence>
            </motion.ul>
        );
};

export default AnimatedList;