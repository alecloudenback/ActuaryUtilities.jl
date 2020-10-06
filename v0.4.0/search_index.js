var documenterSearchIndex = {"docs":
[{"location":"#ActuaryUtilities.jl","page":"Home","title":"ActuaryUtilities.jl","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"","category":"page"},{"location":"","page":"Home","title":"Home","text":"DocTestSetup = quote\n    using ActuaryUtilities\n    using Dates\nend","category":"page"},{"location":"","page":"Home","title":"Home","text":"Modules = [ActuaryUtilities]","category":"page"},{"location":"#ActuaryUtilities.accum_offset-Tuple{Any}","page":"Home","title":"ActuaryUtilities.accum_offset","text":"accum_offset(x; op=*, init=1.0)\n\nA shortcut for the common operation wherein a vector is scanned with an operation, but has an initial value and the resulting array is offset from the traditional accumulate. \n\nThis is a common pattern when calculating things like survivorship given a mortality vector and you want the first value of the resulting vector to be 1.0, and the second value to be 1.0 * x[1], etc.\n\nThree keyword arguments:\n\nop is the binary (two argument) operator you want to use, such as * or +\ninit is the initial value in the returned array\n\nExamples\n\njulia> accum_offset([0.9, 0.8, 0.7])\n3-element Array{Float64,1}:\n 1.0\n 0.9\n 0.7200000000000001\n\njulia> accum_offset(1:5) # the product of elements 1:n, with the default `1` as the first value\n5-element Array{Int64,1}:\n  1\n  1\n  2\n  6\n 24\n\njulia> accum_offset(1:5,op=+)\n5-element Array{Int64,1}:\n  1\n  2\n  4\n  7\n 11\n\n\n\n\n\n\n","category":"method"},{"location":"#ActuaryUtilities.breakeven-Tuple{Array{T,1} where T,Any}","page":"Home","title":"ActuaryUtilities.breakeven","text":"breakeven(cashflows::Vector,accumulation_rate::Real)\n\nCalculate the time when the accumulated cashflows breakeven. Assumes that :\n\ncashflows evenly spaced with the first one occuring at time zero \ncashflows occur at the end of the period\nthat the accumulation rate correponds to the periodicity of the cashflows.\n\nReturns nothing if cashflow stream never breaks even.\n\njulia> breakeven([-10,1,2,3,4,8],0.10)\n5\n\njulia> breakeven([-10,15,2,3,4,8],0.10)\n1\n\njulia> breakeven([-10,-15,2,3,4,8],0.10) # returns the `nothing` value\n\n\n\n\n\n\n\n","category":"method"},{"location":"#ActuaryUtilities.breakeven-Tuple{Array{T,1} where T,Array{T,1} where T,Array{T,1} where T}","page":"Home","title":"ActuaryUtilities.breakeven","text":"breakeven(cashflows::Vector,timepoints::Vector, accumulation_rate)\n\nCalculate the time when the accumulated cashflows breakeven. Assumes that:\n\ncashflows occur at the timepoint indicated at the corresponding timepoints position\ncashflows occur at the end of the period\nthat the accumulation rate corresponds to the periodicity of the cashflows. \nIf given a vector of interest rates, the first rate is effectively never used, as it's treated as the accumulation \n\nrate between time zero and the first cashflow.\n\nReturns nothing if cashflow stream never breaks even.\n\njulia> times = [0,1,2,3,4,5];\n\njulia> breakeven([-10,1,2,3,4,8],times,0.10)\n5\n\njulia> breakeven([-10,15,2,3,4,8],times,0.10)\n1\n\njulia> breakeven([-10,-15,2,3,4,8],times,0.10) # returns the `nothing` value\n\n\n\n\n\n","category":"method"},{"location":"#ActuaryUtilities.convexity-Tuple{Any,Any,Any}","page":"Home","title":"ActuaryUtilities.convexity","text":"convexity(interest_rate,cfs,times)\nconvexity(interest_rate,valuation_function)\n\nCalculates the convexity.     - interest_rate should be a fixed effective yield (e.g. 0.05).\n\nExamples\n\nUsing vectors of cashflows and times\n\njulia> times = 1:5\njulia> cfs = [0,0,0,0,100]\njulia> duration(0.03,cfs,times)\n4.854368932038834\njulia> duration(Macaulay(),0.03,cfs,times)\n5.0\njulia> duration(Modified(),0.03,cfs,times)\n4.854368932038835\njulia> convexity(0.03,cfs,times)\n28.277877274012614\n\n\nUsing any given value function: \n\njulia> lump_sum_value(amount,years,i) = amount / (1 + i ) ^ years\njulia> my_lump_sum_value(i) = lump_sum_value(100,5,i)\njulia> duration(0.03,my_lump_sum_value)\n4.854368932038835\njulia> convexity(0.03,my_lump_sum_value)\n28.277877274012617\n\n\n\n\n\n\n","category":"method"},{"location":"#ActuaryUtilities.duration-Tuple{Dates.Date,Dates.Date}","page":"Home","title":"ActuaryUtilities.duration","text":"duration(d1::Date, d2::Date)\n\nCompute the duration given two dates, which is the number of years since the first date. The interval [0,1) is defined as having  duration 1. Can return negative durations if second argument is before the first.\n\njulia> issue_date  = Date(2018,9,30);\n\njulia> duration(issue_date , Date(2019,9,30) ) \n2\njulia> duration(issue_date , issue_date) \n1\njulia> duration(issue_date , Date(2018,10,1) ) \n1\njulia> duration(issue_date , Date(2019,10,1) ) \n2\njulia> duration(issue_date , Date(2018,6,30) ) \n0\njulia> duration(Date(2018,9,30),Date(2017,6,30)) \n-1\n\n\n\n\n\n","category":"method"},{"location":"#ActuaryUtilities.duration-Tuple{Macaulay,Any,Any,Any}","page":"Home","title":"ActuaryUtilities.duration","text":"duration(Macaulay(),interest_rate,cfs,times)\nduration(Modified(),interest_rate,cfs,times)\nduration(::DV01,interest_rate,cfs,times)\nduration(interest_rate,cfs,times)             # Modified Duration\nduration(interest_rate,valuation_function)    # modified Duration\n\nCalculates the Macaulay, Modified, or DV01 duration.\n\ninterest_rate should be a fixed effective yield (e.g. 0.05).\n\nWhen not given Modified() or Macaulay() as an argument, will default to Modified().\n\nExamples\n\nUsing vectors of cashflows and times\n\njulia> times = 1:5\njulia> cfs = [0,0,0,0,100]\njulia> duration(0.03,cfs,times)\n4.854368932038834\njulia> duration(Macaulay(),0.03,cfs,times)\n5.0\njulia> duration(Modified(),0.03,cfs,times)\n4.854368932038835\njulia> convexity(0.03,cfs,times)\n28.277877274012614\n\n\nUsing any given value function: \n\njulia> lump_sum_value(amount,years,i) = amount / (1 + i ) ^ years\njulia> my_lump_sum_value(i) = lump_sum_value(100,5,i)\njulia> duration(0.03,my_lump_sum_value)\n4.854368932038835\njulia> convexity(0.03,my_lump_sum_value)\n28.277877274012617\n\n\n\n\n\n\n","category":"method"},{"location":"#ActuaryUtilities.internal_rate_of_return-Tuple{Any}","page":"Home","title":"ActuaryUtilities.internal_rate_of_return","text":"internal_rate_of_return(cashflows::vector)\ninternal_rate_of_return(cashflows::Vector, timepoints::Vector)\n\nCalculate the internalrateof_return with given timepoints. If no timepoints given, will assume that a series of equally spaced cashflows, assuming the first cashflow occurring at time zero. \n\nFirst tries to find a rate in the interval [-0.1,0.25]. If none is found, will triple the search range until the range is [-1.5,1.65]. If none is still found, will return nothing.\n\nExample\n\njulia> internal_rate_of_return([-100,110],[0,1]) # e.g. cashflows at time 0 and 1\n0.10000000001652906\n\n\n\n\n\n","category":"method"},{"location":"#ActuaryUtilities.irr","page":"Home","title":"ActuaryUtilities.irr","text":"irr()\n\nAn alias for `internal_rate_of_return`.\n\n\n\n\n\n","category":"function"},{"location":"#ActuaryUtilities.present_value-Union{Tuple{T}, Tuple{T,Any,Any}} where T<:Yields.AbstractYield","page":"Home","title":"ActuaryUtilities.present_value","text":"present_value(interest, cashflows::Vector, timepoints)\npresent_value(interest, cashflows::Vector)\n\nDiscount the cashflows vector at the given interest_interestrate,  with the cashflows occurring at the times specified in timepoints. If no timepoints given, assumes that cashflows happen at times 1,2,...,n.\n\nThe interest can be an InterestCurve, a single scalar, or a vector wrapped in an InterestCurve. \n\nExamples\n\njulia> present_value(0.1, [10,20],[0,1])\n28.18181818181818\njulia> present_value(InterestVector([0.1,0.2]), [10,20],[0,1])\n\nExample on how to use real dates using the DayCounts.jl package\n\n\nusing DayCounts \ndates = Date(2012,12,31):Year(1):Date(2013,12,31)\ntimes = map(d -> yearfrac(dates[1], d, DayCounts.Actual365Fixed()),dates) # [0.0,1.0]\npresent_value(0.1, [10,20],times)\n\n# output\n28.18181818181818\n\n\n\n\n\n\n","category":"method"},{"location":"#ActuaryUtilities.pv","page":"Home","title":"ActuaryUtilities.pv","text":"pv()\n\nAn alias for `present_value`.\n\n\n\n\n\n","category":"function"},{"location":"#ActuaryUtilities.years_between","page":"Home","title":"ActuaryUtilities.years_between","text":"Years_Between(d1::Date, d2::Date)\n\nCompute the number of integer years between two dates, with the  first date typically before the second. Will return negative number if first date is after the second. Use third argument to indicate if calendar  anniversary should count as a full year.\n\nExamples\n\njulia> d1 = Date(2018,09,30);\n\njulia> d2 = Date(2019,09,30);\n\njulia> d3 = Date(2019,10,01);\n\njulia> years_between(d1,d3) \n1\njulia> years_between(d1,d2,false) # same month/day but `false` overlap\n0 \njulia> years_between(d1,d2) # same month/day but `true` overlap\n1 \njulia> years_between(d1,d2) # using default `true` overlap\n1 \n\n\n\n\n\n","category":"function"}]
}
